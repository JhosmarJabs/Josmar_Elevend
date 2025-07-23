namespace controller {
    export class ventana {
        private ventana: d3.Selection<HTMLDivElement, any, any, any>;
        private esVisible: boolean = false;

        public asignarPadre(titulo: string, ventanaPadre: d3.Selection<HTMLDivElement, any, any, any>): d3.Selection<HTMLDivElement, any, any, any> {
            this.ventana = ventanaPadre
            this.diseñoVentana(titulo);
            return this.ventana;
        }

        public diseñoVentana(titulo: string): void {
            this.ventana = d3.select("body")
                .append("div")
                .attr("id", "ventana")
                .style("width", "1100px")
                .style("height", "700px")
                .style("overflow", "auto")
                .style("padding", "10px")
                .style("background-color", "#f0f0f0")
                .style("border", "1px solid #ccc")
                .style("position", "relative");

            this.ventana.append("h3")
                .text(titulo)
                .style("margin-top", "0");

            this.ventana.append("button")
                .text("X")
                .style("position", "absolute")
                .style("top", "5px")
                .style("right", "5px")
                .style("border", "none")
                .style("background", "transparent")
                .style("font-weight", "bold")
                .style("cursor", "pointer")
                .on("click", () => this.cerrar())
        }

        public mostrar(): void {
            if (this.ventana) {
                this.ventana.style("display", "block");
                this.esVisible = true;
            }
        }

        public cerrar(): void {
            if (this.ventana) {
                this.ventana.style("display", "none");
                this.esVisible = false;
            }
        }
    }
}