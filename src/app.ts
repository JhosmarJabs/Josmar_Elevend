  namespace app {
    export class main {
      private _figuras: view.figuras;
      private _usuarios: view.vistaUsuarios;
      private _circulos: view.svgCirculos;

      constructor() {
        d3.select<HTMLBodyElement, unknown>("body")
          .append<HTMLButtonElement>("button")
          .text("rectangulo")
          .style("margin-right", "10px")
          .on("click", (): void => {
            if (!this._figuras) {
              this._figuras = new view.figuras();
            }
            this._figuras.ventanaVisible();
          });

        d3.select<HTMLBodyElement, unknown>("body")
          .append<HTMLButtonElement>("button")
          .text("Usuarios")
          .style("margin-right", "10px")
          .on("click", (): void => {
            if (!this._usuarios) {
              this._usuarios = new view.vistaUsuarios();
            }
            this._usuarios.verPantalla();
          });

        d3.select<HTMLBodyElement, unknown>("body")
          .append<HTMLButtonElement>("button")
          .style("margin-right", "10px")
          .text("Circulo")
          .on("click", (): void => {
            if (!this._circulos) {
              this._circulos = new view.svgCirculos();
            }
            this._circulos.abrirPantallaCirculos();
          });
      }
    }
  }

  var appMain: app.main = new app.main(); 