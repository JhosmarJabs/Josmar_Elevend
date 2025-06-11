var figuras;
(function (figuras_1) {
    class figuras {
        constructor() {
            this.ventanaActiva = false;
            this.crearVentana();
        }
        ventanaVisible() {
            this.ventanaActiva = !this.ventanaActiva;
            if (!this.ventanaActiva) {
                this.vistaVentana.style("display", "block");
                console.log("block");
            }
            else {
                this.vistaVentana.style("display", "none");
                console.log("none");
            }
        }
        crearVentana() {
            this.vistaVentana = d3.select("body")
                .append("div")
                .attr("id", "ventana")
                .style("width", "300px")
                .style("padding", "10px")
                .style("background-color", "#f0f0f0")
                .style("border", "1px solid #ccc")
                .style("position", "relative");
            this.vistaVentana.append("div")
                .style("position", "absolute")
                .style("top", "5px")
                .style("right", "10px")
                .style("cursor", "pointer")
                .style("font-weight", "bold")
                .style("font-size", "16px")
                .text("×")
                .on("click", () => {
                this.ventanaVisible();
            });
            this.vistaVentana.append("h3")
                .style("margin-top", "5px")
                .style("margin-right", "20px")
                .text("Área del rectángulo");
            this.txtbase = this.vistaVentana.append("input")
                .attr("type", "number")
                .attr("id", "baseRectangulo")
                .attr("placeholder", "Base")
                .attr("required", true);
            this.txttaltura = this.vistaVentana.append("input")
                .attr("type", "number")
                .attr("id", "alturaRectangulo")
                .attr("placeholder", "Altura")
                .attr("required", true);
            this.vistaVentana.append("button")
                .text("Calcular área")
                .on("click", () => {
                this.calcularArea();
            });
            this.vistaVentana.append("br");
            this.vistaVentana.append("br");
            this.vistaVentana.append("label")
                .text("Área: ");
            this.areaElemento = this.vistaVentana.append("div")
                .attr("id", "areaResultadoRectangulo");
        }
        calcularArea() {
            let base = Number(this.txtbase.node().value);
            let altura = Number(this.txttaltura.node().value);
            if (base > 0 && altura > 0) {
                const area = base * altura;
                this.areaElemento.text(area.toString());
            }
            else {
                this.areaElemento.text("Ingrese valores válidos.");
            }
        }
    }
    figuras_1.figuras = figuras;
})(figuras || (figuras = {}));
//# sourceMappingURL=figuras.js.map