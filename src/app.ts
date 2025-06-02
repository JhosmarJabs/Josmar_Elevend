namespace app {
  export class main {
    private _figuras: figuras.figuras;
    private _usuarios: pantallaUsuarios.pantallaUsuarios;
    private _circulos: svgCirculos.svgCirculos;

    constructor() {
      d3.select<HTMLBodyElement, unknown>("body")
        .append<HTMLButtonElement>("button")
        .text("rectangulo")
        .style("margin-right", "10px")
        .on("click", (): void => {
          if (!this._figuras) {
            this._figuras = new figuras.figuras();
          }
          this._figuras.ventanaVisible();
        });

      d3.select<HTMLBodyElement, unknown>("body")
        .append<HTMLButtonElement>("button")
        .text("Usuarios")
        .style("margin-right", "10px")
        .on("click", (): void => {
          if (!this._usuarios) {
            this._usuarios = new pantallaUsuarios.pantallaUsuarios();
          }
          this._usuarios.alternarVentanaPrincipal();
        });

      d3.select<HTMLBodyElement, unknown>("body")
        .append<HTMLButtonElement>("button")
        .style("margin-right", "10px")
        .text("Circulo")
        .on("click", (): void => {
          if (!this._circulos) {
            this._circulos = new svgCirculos.svgCirculos();
          }
          this._circulos.abrirPantallaCirculos();
        });
    }
  }
}

var appMain: app.main = new app.main();