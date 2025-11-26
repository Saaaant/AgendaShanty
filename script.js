const API_KEY = "974e12558b3763f20f401153b1bf7746";
const FORM_ID = "24972c799b4b";

const horaSelect = document.getElementById("hora");
const fechaInput = document.getElementById("fecha");
const form = document.getElementById("formCita");
const mensajeExito = document.getElementById("mensajeExito");

// -------------------------------
// GENERAR HORAS 10:00 AM A 7:00 PM
// -------------------------------
function generarHoras() {
  const horas = [];
  let hora = 10;
  let minuto = 0;

  while (hora < 19) {
    const h = hora.toString().padStart(2, "0");
    const m = minuto.toString().padStart(2, "0");
    horas.push(`${h}:${m}`);

    minuto += 40;
    if (minuto >= 60) {
      minuto -= 60;
      hora++;
    }
  }

  horaSelect.innerHTML = horas.map(h => `<option value="${h}">${h}</option>`).join("");
}

// -------------------------------
// CONSULTAR CITAS OCUPADAS DESDE BASIN
// -------------------------------
async function obtenerCitas(fecha) {
  const res = await fetch(`https://usebasin.com/api/v1/submissions/${FORM_ID}`, {
    headers: { "Authorization": `Bearer ${API_KEY}` }
  });

  const data = await res.json();

  return data.submissions
    .filter(s => s.data.fecha === fecha)
    .map(s => s.data.hora);
}

// -------------------------------
// BLOQUEAR HORAS YA OCUPADAS
// -------------------------------
async function actualizarHoras() {
  generarHoras();
  const fecha = fechaInput.value;
  if (!fecha) return;

  const ocupadas = await obtenerCitas(fecha);

  for (let option of horaSelect.options) {
    if (ocupadas.includes(option.value)) {
      option.disabled = true;
      option.textContent = `${option.value} (Ocupada)`;
    }
  }
}

// -------------------------------
// MENSAJE DE ÉXITO
// -------------------------------
form.addEventListener("submit", () => {
  mensajeExito.style.display = "block";
  setTimeout(() => mensajeExito.style.display = "none", 6000);
});

// -------------------------------
fechaInput.min = new Date().toISOString().split("T")[0];
fechaInput.addEventListener("change", actualizarHoras);
generarHoras();