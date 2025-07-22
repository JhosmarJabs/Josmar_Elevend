namespace data {
    export class datoEmpresas {
        private empresas: entidades.IEmpresa[] = []

        public loaderEmpresasAPI(): void {
            this.cargarEmpresas();
        }

        public getEmpresas(): entidades.IEmpresa[] {
            return this.empresas;
        }

        private cargarEmpresas(): void {
            const url = config.ApiConfig.API_EMPRESAS;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const empresas: entidades.IEmpresa[] = data;
                    this.empresas = empresas;

                    if (data.length > 0) {

                    }
                })
                .catch(error => {
                    console.error("Error al consultar empresas:", error);
                });
        }
    }
}