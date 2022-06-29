// import {} from "https://cdn.jsdelivr.net/npm/esprima@4.0.1/dist/esprima.js";
import {} from "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.min.js";
// import {} from "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/addons/p5.sound.min.js";


class TestElement extends HTMLElement {
    #shadowRoot = null;
    
    constructor() {
      super();
      this.#shadowRoot = this.attachShadow({ mode:'open' });
      this.#shadowRoot.innerHTML = this.template
    }
    
    get template() {
      return `
        <slot></slot>
      `;
    }
    
    get #scripts() {
      return this.#shadowRoot.querySelectorAll('script');
    }
    
    #scopedEval = (script) => 
      Function(script).bind(this.#shadowRoot)();
    
    #processScripts() {
      this.#scripts.forEach(
        s => this.#scopedEval(s.innerHTML)
      );
    }
  
    async connectedCallback(

    ) {
        let name = this.getAttribute("name")
        let src = this.getAttribute("src")
        // console.log(src)
        // let p5lib = await (await fetch('p5.js')).text()
        // let p5lib = await (await fetch('https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.min.js')).text()
        let script
        // let script = `<script>${p5lib}</script>`
        // this.#shadowRoot.innerHTML+= script
        this.#shadowRoot.innerHTML+= `<div id="sketch${name}"></div>`
        this.#shadowRoot.innerHTML+= `<div id="sketchd${name}"></div>`
        // esprima = eval(esprima)
        // this.#shadowRoot.innerHTML+= `<script>${esprima}</script>`
        
        let sketch = await (await fetch('sketch.js')).text()
        
        let n = new p5((d)=>{
            d.setup = function(){
                d.createCanvas(0,0)
            }
            return d

        })
        
        let p5_protos = Object.keys(n.__proto__)
        let p5vars = []
        let p5funcs = []
        p5_protos.forEach(p=>{
            // console.log(p, typeof n.__proto__[p])
            if(typeof n.__proto__[p] == 'function'){
                p5funcs.push(p)
            }else{
                p5vars.push(p)
            }
        })
        n = null

        var instance = `p5${name}`

        for (const p5var of p5vars) {
            sketch = sketch.replace(new RegExp(`([^.\\w])(${p5var})[;\\s]?`, 'gm'), (match, p1, p2) => `${p1}${instance}.${p2}`)
          }
        for (const p5func of p5funcs) {
            sketch = sketch.replace(new RegExp(`([^.\\w])(${p5func}[(])`, 'gm'), (match, p1, p2) => `${p1}${instance}.${p2}`)
        }
        console.log(sketch)

        let names  = []
        let p = esprima.parse(sketch)
        console.log(p.body.forEach(e=>{
            if(e.declarations){
                e.declarations.forEach(dd=>{
                    names.push(dd.id.name)
                })
            }else{
                names.push(e.id.name)
            }
        }))
        console.log(names)
        script = `<script>
        let ${instance} = (${instance}) =>{
            ${sketch}
            Object.assign(${instance}, {
                ${names.join(',')}
            })
            return {}
        }
        let div = this.getElementById("sketch${name}").innerHTML = "";
        new p5(${instance}, this.getElementById("sketch${name}"))
        </script>`
        this.#shadowRoot.innerHTML+= script
        
        this.#processScripts();
        let a = this.#shadowRoot.getElementById(`sketch${name}`)
        console.log(a)
        a.removeChild(a.firstChild)
        console.log(a.firstChild)
        
    }
  }
  
  customElements.define('test-element', TestElement);