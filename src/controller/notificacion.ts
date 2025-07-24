namespace controller {
    export class Notificacion {
        private container: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private alerts: Map<string, any> = new Map();

        constructor(notificacion: entidades.iNotificacion) {
            this.inicializarContenedor();
            this.mostrar(notificacion);
        }

        private inicializarContenedor(): void {
            this.container = d3.select('body')
                .append('div')
                .attr('class', 'alert-container')
                .style('position', 'fixed')
                .style('top', '20px')
                .style('right', '20px')
                .style('z-index', '9999')
                .style('pointer-events', 'none')
                .style('max-width', '400px')
                .style('width', 'auto');
        }

        public mostrar(notificacion: entidades.iNotificacion): string {
            const duration = 5000;
            const alertId = 'alert_' + Math.floor(Math.random() * 1000000);

            const icons = {
                success: '✓',
                error: '✕',
                warning: '!',
                info: 'i'
            };

            const colors = {
                success: { bg: '#28a745', border: '#28a745' },
                error: { bg: '#dc3545', border: '#dc3545' },
                warning: { bg: '#ffc107', border: '#ffc107' },
                info: { bg: '#17a2b8', border: '#17a2b8' }
            };

            const alertElement = this.container
                .append('div')
                .attr('class', `floating-alert ${notificacion.type}`)
                .attr('id', alertId)
                .style('background', 'white')
                .style('border-radius', '8px')
                .style('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.15)')
                .style('margin-bottom', '10px')
                .style('overflow', 'hidden')
                .style('border-left', `4px solid ${colors[notificacion.type].border}`)
                .style('position', 'relative')
                .style('max-width', '400px')
                .style('width', '100%')
                .style('pointer-events', 'auto')
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
                .style('color', notificacion.type === 'warning' ? '#333' : 'white')
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .style('flex-shrink', '0')
                .style('margin-top', '2px')
                .style('background-color', colors[notificacion.type].bg)
                .text(icons[notificacion.type]);

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
                .text(notificacion.title);

            textContainer
                .append('div')
                .attr('class', 'alert-message')
                .style('font-size', '13px')
                .style('color', '#666')
                .style('line-height', '1.4')
                .text(notificacion.message);

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
                    this.cerrar(alertId);
                });

            const progressBar = alertElement
                .append('div')
                .attr('class', 'progress-bar')
                .style('position', 'absolute')
                .style('bottom', '0')
                .style('left', '0')
                .style('height', '3px')
                .style('background-color', colors[notificacion.type].bg)
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

            const timer = setTimeout(() => {
                this.cerrar(alertId);
            }, duration);

            this.alerts.set(alertId, {
                element: alertElement,
                timer: timer
            });

            return alertId;
        }

        public cerrar(alertId: string): void {
            const alertData = this.alerts.get(alertId);
            if (!alertData) return;

            const { element, timer } = alertData;

            clearTimeout(timer);

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
    }
}