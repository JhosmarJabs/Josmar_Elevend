var app;
(function (app) {
    class main {
        constructor() {
            d3.select("body")
                .append("button")
                .text("rectangulo")
                .style("margin-right", "10px")
                .on("click", () => {
                if (!this._figuras) {
                    this._figuras = new figuras.figuras();
                }
                this._figuras.ventanaVisible();
            });
            d3.select("body")
                .append("button")
                .text("Usuarios")
                .style("margin-right", "10px")
                .on("click", () => {
                if (!this._usuarios) {
                    this._usuarios = new pantallaUsuarios.pantallaUsuarios();
                }
                this._usuarios.verPantalla();
            });
            d3.select("body")
                .append("button")
                .style("margin-right", "10px")
                .text("Circulo")
                .on("click", () => {
                if (!this._circulos) {
                    this._circulos = new svgCirculos.svgCirculos();
                }
                this._circulos.abrirPantallaCirculos();
            });
        }
    }
    app.main = main;
})(app || (app = {}));
var appMain = new app.main();
//# sourceMappingURL=app.js.map