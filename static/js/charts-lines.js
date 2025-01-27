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

// Configuración inicial del gráfico
const lineConfig = {
  type: 'line',
  data: {
    labels: [], // Se actualizará dinámicamente con los tipos de animales
    datasets: [
      {
        label: 'Cantidad de apariciones',
        backgroundColor: '#0694a2',
        borderColor: '#0694a2',
        data: [], // Se actualizará dinámicamente con las cantidades
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    legend: {
      display: false,
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Tipo de Animal',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Número de Apariciones',
        },
      },
    },
  },
};

// Crear gráfico en el canvas con id 'line'
const lineCtx = document.getElementById('line');
window.myLine = new Chart(lineCtx, lineConfig);

// Función para actualizar el gráfico con los datos de Firebase
const updateChart = () => {
  fetch('/api/v1/landing')
    .then(response => response.json())
    .then(data => {
      const animalCounts = countAnimals(data);

      // Actualizar los datos del gráfico
      window.myLine.data.labels = Object.keys(animalCounts);
      window.myLine.data.datasets[0].data = Object.values(animalCounts);

      // Refrescar el gráfico
      window.myLine.update();
    })
    .catch(error => console.error('Error al obtener datos:', error));
};

// Llamar a la función para cargar los datos iniciales
updateChart();
