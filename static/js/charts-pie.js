/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */
const pieConfig = {
  type: 'doughnut',
  data: {
    datasets: [
      {
        data: [33, 33, 33],
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: ['#0694a2', '#1c64f2', '#7e3af2'],
        label: 'Dataset 1',
      },
    ],
    labels: ['Shoes', 'Shirts', 'Bags'],
  },
  options: {
    responsive: true,
    cutoutPercentage: 80,
    /**
     * Default legends are ugly and impossible to style.
     * See examples in charts.html to add your own legends
     *  */
    legend: {
      display: false,
    },
  },
}

// change this to the id of your chart element in HMTL
const pieCtx = document.getElementById('pie')
window.myPie = new Chart(pieCtx, pieConfig)

// Función para procesar el JSON
countCommentsByHour = (data) => {
  // Inicializar contadores por rango de horas
  const labels = ["0 a.m. - 8 a.m.", "8 a.m. - 16 p.m.", "16 p.m. - 0 a.m."];
  const counts = [0, 0, 0];

  Object.values(data).forEach(record => {
    const savedTime = record.saved;
    if (!savedTime) {
      return;
    }

    // Reemplazar AM/PM correctamente y eliminar espacios no rompibles
    const formattedTime = savedTime.replace(/\u00A0/g, ' ') // Elimina espacios no rompibles
                                   .replace('a. m.', 'AM')
                                   .replace('p. m.', 'PM');


    // Separar fecha y hora
    let [datePart, timePart] = formattedTime.split(', ');

    if (!datePart || !timePart) {
      console.error("Formato de fecha inesperado:", formattedTime);
      return;
    }

    // Convertir fecha de "DD/MM/YYYY" a "YYYY-MM-DD"
    let [day, month, year] = datePart.split('/');
    let isoFormattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${timePart}`;

    // Crear objeto Date
    const dt = new Date(isoFormattedDate);

    if (isNaN(dt)) {
      console.error("Error: Formato de fecha inválido incluso después de reformatear", isoFormattedDate);
      return;
    }

    const hour = dt.getHours();

    // Clasificar en el rango correspondiente
    if (hour >= 0 && hour < 8) {
      counts[0]++;
    } else if (hour >= 8 && hour < 16) {
      counts[1]++;
    } else {
      counts[2]++;
    }
  });

  return { labels, counts };
};

update = () => {
  fetch('/api/v1/landing')
    .then(response => response.json())
    .then(data => {

      let { labels, counts } = countCommentsByHour(data)

      // Reset data
      window.myPie.data.labels = [];
      window.myPie.data.datasets[0].data = [];

      // New data
      window.myPie.data.labels = [...labels]
      window.myPie.data.datasets[0].data = [...counts]

      window.myPie.update();

    })
    .catch(error => console.error('Error:', error));
}

update();