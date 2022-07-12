const esprima = require('esprima')
const p5 = require('p5')
window.p5 = p5
// import {} from "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.min.js";
// import {} from "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/addons/p5.sound.min.js";


class P5Sketch extends HTMLElement {
    #shadowRoot = null;
    
    constructor() {
      super();
      this.#shadowRoot = this.attachShadow({ mode:'open' });
      this.#shadowRoot.innerHTML = this.template
    }
    
    get template() {
      return ``;
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
        let script
        this.#shadowRoot.innerHTML+= `<div id="sketch${name}" class="p5"></div>`
        
        let sketch = await (await fetch(src)).text()
        
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
            if(typeof n.__proto__[p] == 'function'){
                p5funcs.push(p)
            }else{
                p5vars.push(p)
            }
        })
        n.remove()

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
  
  customElements.define('p5-sketch', P5Sketch);