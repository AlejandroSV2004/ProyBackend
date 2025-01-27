// Función para contar el número de apariciones de cada tipo de animal
const countAnimals = (data) => {
  const animalCounts = {};

  Object.values(data).forEach(record => {
    const animalType = record.tipomascota;
    if (animalType) {
      animalCounts[animalType] = (animalCounts[animalType] || 0) + 1;
    }
  });

  return animalCounts;
};

// Configuración inicial del gráfico de barras
const barConfig = {
  type: 'bar',
  data: {
    labels: [], // Se actualizará dinámicamente con los tipos de animales
    datasets: [
      {
        label: 'Cantidad de apariciones',
        backgroundColor: '#0694a2', // Color de las barras
        borderWidth: 1,
        data: [], // Se actualizará dinámicamente con las cantidades
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false, // Evita que el gráfico sea comprimido
    plugins: {
      legend: {
        display: false, // Oculta la leyenda si es innecesaria
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.raw} apariciones`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tipo de Animal',
          color: '#FFFFFF',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Número de Apariciones',
          color: '#FFFFFF',
        },
        beginAtZero: true, // Asegura que el gráfico empiece desde 0
        ticks: {
          stepSize: 1, // Hace que los valores del eje Y aumenten de 1 en 1
          precision: 0, // Evita mostrar decimales
          callback: function (value) {
            return Number.isInteger(value) ? value : ''; // Solo muestra valores enteros
          },
        },
        suggestedMin: 0, // Asegura que el mínimo sea 0
        suggestedMax: (ctx) => {
          const maxData = Math.max(...ctx.chart.data.datasets[0].data);
          return maxData < 5 ? 5 : maxData; // Ajusta el máximo dinámicamente
        },
      },
    },
  },
};



// Crear gráfico en el canvas con id 'bars'
const barsCtx = document.getElementById('bars');
window.myBar = new Chart(barsCtx, barConfig);

// Función para actualizar el gráfico con los datos de Firebase
const updateChart = () => {
  fetch('/api/v1/landing')  // Cambia la URL si es necesario
    .then(response => response.json())
    .then(data => {
      const animalCounts = countAnimals(data);

      // Actualizar datos del gráfico
      window.myBar.data.labels = Object.keys(animalCounts);
      window.myBar.data.datasets[0].data = Object.values(animalCounts);

      // Refrescar el gráfico
      window.myBar.update();
    })
    .catch(error => console.error('Error al obtener datos:', error));
};

// Cargar los datos al inicio
updateChart();
