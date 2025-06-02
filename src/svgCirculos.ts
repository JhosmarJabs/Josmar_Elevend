namespace svgCirculos {
    interface ICirculos {
        id: number;
        x: number;
        y: number;
        r: number;
        color: string;
    }

    export class svgCirculos {
        private contenedor: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
        private visible: boolean = true;
        private circulos: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;

        private circulosDatos: Map<number, ICirculos> = new Map();
        
        constructor() {
            this.crearPantalla();
            this.agregarBotones();
            this.agregarCirculo();
        }

        private crearPantalla(): void {
            this.contenedor = d3.select("body")
                .append("div")
                .attr("id", "contenedor-svg")
                .style("position", "relative")
                .style("display", "block")
                .style("width", "800px")
                .style("margin", "20px auto")
                .style("padding", "10px")
                .style("background-color", "#fff")
                .style("box-shadow", "0 0 10px rgba(0,0,0,0.1)")
                .style("border-radius", "8px");

            this.contenedor.append("button")
                .text("X")
                .attr("id", "btn-cerrar")
                .style("position", "absolute")
                .style("top", "10px")
                .style("right", "10px")
                .style("background-color", "#dc3545")
                .style("color", "#fff")
                .style("border", "none")
                .style("border-radius", "50%")
                .style("width", "28px")
                .style("height", "28px")
                .style("cursor", "pointer")
                .style("font-weight", "bold")
                .on("click", () => this.cerrarPantallaCirculos());

            this.svg = this.contenedor.append("svg")
                .attr("width", 800)
                .attr("height", 600)
                .style("border", "3px solid #ccc")
                .style("background-color", "#f9f9f9");
        }

        public abrirPantallaCirculos(): void {
            this.visible = true;
            this.contenedor.style("display", "block");
        }

        public cerrarPantallaCirculos(): void {
            this.visible = false;
            this.contenedor.style("display", "none");
        }

        private generarColorAleatorio(): string {
            return "#" + Math.floor(Math.random() * 16777215).toString(16);
        }

        private agregarCirculo(): void {
            const r = 30;
            const x = Math.random() * (800 - 2 * r) + r;
            const y = Math.random() * (600 - 2 * r) + r;
            const id = Math.random();

            const circulo: ICirculos = {
                id,
                x,
                y,
                r,
                color: this.generarColorAleatorio(),
            };

            this.circulosDatos.set(id, circulo);

            this.renderizarCirculos();
        }

        private renderizarCirculos(): void {
            const datosArray = Array.from(this.circulosDatos.values());
            
            const circulos = this.svg.selectAll<SVGCircleElement, ICirculos>("circle")
                .data(datosArray, (d: any) => d.id);

            circulos.enter()
                .append("circle")
                .attr("r", d => d.r)
                .attr("fill", d => d.color)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .style("cursor", "pointer")
                .call(
                    d3.drag<SVGCircleElement, ICirculos>()
                        .on("start", function (event, d) {
                            d3.select(this).attr("stroke", "#000").attr("stroke-width", 4);
                        })
                        .on("drag", function (event, d) {
                            const min = d.r;
                            const maxX = 800 - min;
                            const maxY = 600 - min;

                            d.x = Math.max(min, Math.min(maxX, event.x));
                            d.y = Math.max(min, Math.min(maxY, event.y));

                            d3.select(this)
                                .attr("cx", d.x)
                                .attr("cy", d.y);
                        })
                        .on("end", function (event, d) {
                            if (d3.select(this).attr("class") !== "eliminar") {
                                d3.select(this).attr("stroke", "none");
                            }
                        })
                )

                .on("click", (event, d) => {
                    this.circulosDatos.delete(d.id);
                    
                    d3.select(event.currentTarget)
                        .attr("stroke", "#141414")
                        .attr("class", "eliminar")
                        .attr("stroke-width", 4);
                });
        }

        private agregarBotones(): void {
            const grupoBotones = this.contenedor.append("div")
                .style("margin-top", "10px")
                .style("text-align", "center");

            grupoBotones.append("button")
                .text("Agregar Círculo")
                .style("margin", "0 10px")
                .on("click", () => this.agregarCirculo());

            grupoBotones.append("button")
                .text("Eliminar Círculo")
                .style("margin", "0 10px")
                .on("click", () => {
                    d3.selectAll(".eliminar").each((d: any) => {
                        this.circulosDatos.delete(d.id);
                    });
                    d3.selectAll(".eliminar").remove();
                });
        }
    }
}