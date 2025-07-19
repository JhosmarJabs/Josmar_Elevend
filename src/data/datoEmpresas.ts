namespace data {

    export class datoEmpresas {

        private consultarEmpresasAPI(): void {
            const url = config.ApiConfig.API_EMPRESAS;

           /*  fetch(url, {
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
                    console.log('Empresas recibidas:', data);

                    const empresas: entidades.IEmpresa[] = data;
                    this.empresas = empresas;
                    this.llenarSelectEmpresas();


                    if (data.length > 0) {
                        Swal.fire({
                            icon: 'info',
                            title: 'Empresas cargadas',
                            text: `${data.length} empresas disponibles`,
                            timer: 1500,
                            showConfirmButton: false,
                            toast: true,
                            position: 'top-end'
                        });
                    }
                })
                .catch(error => {
                    console.error("Error al consultar empresas:", error);
                    this.mostrarErrorEmpresa("No se pudieron cargar las empresas");


                    Swal.fire({
                        icon: 'error',
                        title: 'Error al cargar empresas',
                        text: 'No se pudieron obtener las empresas disponibles',
                        confirmButtonText: 'Entendido'
                    });
                }); */
        }
    }
}