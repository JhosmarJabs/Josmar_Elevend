namespace data {
    export class datoEmpresas {
        private empresas: entidades.IEmpresa[] = []


        public loaderEmpresasAPI(callback?: (resp: number) => void): void {
            this.cargarEmpresas((resp: number) => {
                if (callback) callback(resp);
            });
        }
        public getEmpresas(): entidades.IEmpresa[] {
            return this.empresas;
        }

        private cargarEmpresas(callback: (resp: number) => void): void {
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

                    if (callback)
                        callback(data.length);
                })
                .catch(error => {
                    console.error("Error al consultar empresas:", error);
                    if (callback) {
                        callback(-100);
                    }
                });
        }
    }
}