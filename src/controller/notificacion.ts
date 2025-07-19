namespace controller {
    export class Notificacion {
        private container: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private alerts: Map<string, any> = new Map();

        constructor() {
            this.inicializarContenedor();
        }

        private inicializarContenedor(): void {
            let contenedor = d3.select('.alert-container');

            if (contenedor.empty()) {
                contenedor = d3.select('body')
                    .append('div')
                    .attr('class', 'alert-container');
            }

            this.container = contenedor as d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        }

        public note(padre: d3.Selection<SVGElement, unknown, HTMLElement, any>, notificacion: entidades.iNotificacion): string {
            
            this.show(notificacion);
            return "alert";
        } 

        private show(not : entidades.iNotificacion): string {
            let duration = 5000;
            const alertId = 'alert_' + Math.floor(Math.random() * 1000);

            const icons = {
                success: '✓',
                error: '✕',
                warning: '!',
                info: 'i'
            };

            const colors = {
                success: { bg: '#28a745', border: '#28a745', text: '#155724' },
                error: { bg: '#dc3545', border: '#dc3545', text: '#721c24' },
                warning: { bg: '#ffc107', border: '#ffc107', text: '#856404' },
                info: { bg: '#17a2b8', border: '#17a2b8', text: '#0c5460' }
            };

            const alertElement = this.container
                .append('div')
                .attr('class', `floating-alert ${not.type}`)
                .attr('id', alertId)
                .style('background', 'white')
                .style('border-radius', '8px')
                .style('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.15)')
                .style('margin-bottom', '10px')
                .style('overflow', 'hidden')
                .style('border-left', `4px solid ${colors[not.type].border}`)
                .style('position', 'relative')
                .style('max-width', '400px')
                .style('width', '100%')
                .style('transform', 'translateX(450px)')
                .style('opacity', 0);

            const alertContent = alertElement
                .append('div')
                .attr('class', 'alert-content')
                .style('padding', '16px 20px')
                .style('display', 'flex')
                .style('align-items', 'flex-start')
                .style('gap', '12px');

            alertContent
                .append('div')
                .attr('class', 'alert-icon')
                .style('width', '20px')
                .style('height', '20px')
                .style('border-radius', '50%')
                .style('display', 'flex')
                .style('align-items', 'center')
                .style('justify-content', 'center')
                .style('color', not.type === 'warning' ? '#333' : 'white')
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .style('flex-shrink', '0')
                .style('margin-top', '2px')
                .style('background-color', colors[not.type].bg)
                .text(icons[not.type]);

            const textContainer = alertContent
                .append('div')
                .attr('class', 'alert-text')
                .style('flex-grow', '1');

            textContainer
                .append('div')
                .attr('class', 'alert-title')
                .style('font-weight', 'bold')
                .style('font-size', '14px')
                .style('margin-bottom', '4px')
                .style('color', '#333')
                .text(not.title);

            textContainer
                .append('div')
                .attr('class', 'alert-message')
                .style('font-size', '13px')
                .style('color', '#666')
                .style('line-height', '1.4')
                .text(not.message);

            alertContent
                .append('button')
                .attr('class', 'alert-close')
                .style('background', 'none')
                .style('border', 'none')
                .style('font-size', '18px')
                .style('color', '#999')
                .style('cursor', 'pointer')
                .style('padding', '0')
                .style('width', '20px')
                .style('height', '20px')
                .style('display', 'flex')
                .style('align-items', 'center')
                .style('justify-content', 'center')
                .style('border-radius', '50%')
                .style('transition', 'all 0.2s ease')
                .style('flex-shrink', '0')
                .html('&times;')
                .on('mouseover', function () {
                    d3.select(this)
                        .style('background-color', '#f0f0f0')
                        .style('color', '#666');
                })
                .on('mouseout', function () {
                    d3.select(this)
                        .style('background-color', 'transparent')
                        .style('color', '#999');
                })
                .on('click', () => {
                    this.close(alertId);
                });

            const progressBar = alertElement
                .append('div')
                .attr('class', 'progress-bar')
                .style('position', 'absolute')
                .style('bottom', '0')
                .style('left', '0')
                .style('height', '3px')
                .style('background-color', colors[not.type].bg)
                .style('width', '100%')
                .style('transform-origin', 'left')
                .style('z-index', '10')
                .style('transform', 'scaleX(1)');

            alertElement
                .transition()
                .delay(10)
                .duration(300)
                .ease(d3.easeBack)
                .style('transform', 'translateX(0px)')
                .style('opacity', 1);

            progressBar
                .transition()
                .duration(duration)
                .ease(d3.easeLinear)
                .style('transform', 'scaleX(0)');

            const timeoutId = setTimeout(() => {
                this.close(alertId);
            }, duration);

            this.alerts.set(alertId, {
                element: alertElement,
                timeoutId: timeoutId
            });

            return alertId;
        }

        public close(alertId: string): void {
            const alertData = this.alerts.get(alertId);
            if (!alertData) return;

            const { element, timeoutId } = alertData;

            clearTimeout(timeoutId);

            element
                .transition()
                .duration(300)
                .ease(d3.easeBackIn)
                .style('transform', 'translateX(400px)')
                .style('opacity', 0)
                .on('end', () => {
                    element.remove();
                    this.alerts.delete(alertId);
                });
        }

        public closeAll(): void {
            this.alerts.forEach((alertData, alertId) => {
                this.close(alertId);
            });
        }

/*         public success(title: string, message: string): string {
            return this.show('success', title, message);
        }

        public error(title: string, message: string): string {
            return this.show('error', title, message);
        }

        public warning(title: string, message: string): string {
            return this.show('warning', title, message);
        }

        public info(title: string, message: string): string {
            return this.show('info', title, message);
        } */
    }
}
