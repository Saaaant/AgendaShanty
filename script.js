const API_KEY = "974e12558b3763f20f401153b1bf7746";
const FORM_ID = "24972c799b4b";

const horaSelect = document.getElementById("hora");
const fechaInput = document.getElementById("fecha");

// --------------------------------------
// GENERA HORAS DE 10 AM A 7 PM CADA 40 MIN
// --------------------------------------
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

  horaSelect.innerHTML = horas
    .map(h => `<option value="${h}">${h}</option>`)
    .join("");
}

// -------------------------------------------------
// CONSULTAR CITAS OCUPADAS DESDE BASIN (EN TIEMPO REAL)
// -------------------------------------------------
async function obtenerCitas(fecha) {
  try {
    const res = await fetch(
      `https://usebasin.com/api/v1/submissions/${FORM_ID}`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    );

    const data = await res.json();

    return data.submissions
      .filter(entry => entry.data.fecha === fecha)
      .map(entry => entry.data.hora);

  } catch (err) {
    console.error("Error consultando Basin:", err);
    return [];
  }
}

// -------------------------------------------------
// BLOQUEAR HORAS YA OCUPADAS PARA TODOS LOS USUARIOS
// -------------------------------------------------
async function actualizarHoras() {
  const fecha = fechaInput.value;
  if (!fecha) return;

  generarHoras();

  const ocupadas = await obtenerCitas(fecha);

  for (let option of horaSelect.options) {
    if (ocupadas.includes(option.value)) {
      option.disabled = true;
      option.textContent = `${option.value} (Ocupada)`;
      option.style.color = "#ff6b6b";
    }
  }
}

// -------- FECHA MÍNIMA --------
fechaInput.min = new Date().toISOString().split("T")[0];

// -------- EVENTO --------
fechaInput.addEventListener("change", actualizarHoras);

// -------- AL CARGAR LA PÁGINA --------
generarHoras();
