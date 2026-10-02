const API_URL = "https://pokeapi.co/api/v2/pokemon/";

const input = document.getElementById("pokemon-input");
const listaPokemon = document.getElementById("lista-pokemon");
const pokemonDetalle = document.getElementById("pokemon-detalle");
const cantidad = document.getElementById("cantidad");

let todosLosPokemon = [];


// ==========================================
// TRADUCCIONES
// ==========================================

const traducciones = {

    // Estadísticas
    hp: "Vida",
    attack: "Ataque",
    defense: "Defensa",
    "special-attack": "Ataque Especial",
    "special-defense": "Defensa Especial",
    speed: "Velocidad",

    // Tipos
    normal: "Normal",
    fire: "Fuego",
    water: "Agua",
    electric: "Eléctrico",
    grass: "Planta",
    ice: "Hielo",
    fighting: "Lucha",
    poison: "Veneno",
    ground: "Tierra",
    flying: "Volador",
    psychic: "Psíquico",
    bug: "Bicho",
    rock: "Roca",
    ghost: "Fantasma",
    dragon: "Dragón",
    dark: "Siniestro",
    steel: "Acero",
    fairy: "Hada",

    // Habilidades
    "limber": "Flexibilidad",
    "imposter": "Impostor",
    "static": "Electricidad Estática",
    "lightning-rod": "Pararrayos",
    "blaze": "Mar Llamas",
    "torrent": "Torrente",
    "overgrow": "Espesura",
    "chlorophyll": "Clorofila",
    "intimidate": "Intimidación",
    "levitate": "Levitación",
    "pressure": "Presión",
    "synchronize": "Sincronía",
    "inner-focus": "Foco Interno",
    "keen-eye": "Vista Lince",
    "early-bird": "Madrugar",
    "water-absorb": "Absorbe Agua",
    "volt-absorb": "Absorbe Electricidad",
    "flash-fire": "Absorbe Fuego",
    "swift-swim": "Nado Rápido",
    "sand-veil": "Velo Arena",
    "rock-head": "Cabeza Roca",
    "sturdy": "Robustez",
    "run-away": "Fuga",
    "adaptability": "Adaptable",
    "cute-charm": "Gran Encanto",
    "magic-guard": "Muro Mágico",
    "unaware": "Ignorante",
    "guts": "Agallas",
    "poison-point": "Punto Tóxico",
    "water-veil": "Velo Agua",
    "magma-armor": "Escudo Magma",
    "flame-body": "Cuerpo Llama",
    "insomnia": "Insomnio",
    "clear-body": "Cuerpo Puro",
    "serene-grace": "Dicha",
    "skill-link": "Encadenado",
    "technician": "Experto",
    "multiscale": "Compensación"
};


// ==========================================
// CARGAR TODOS LOS POKÉMON
// ==========================================

async function cargarPokemon() {

    try {

        cantidad.textContent = "Cargando Pokémon...";

        const respuesta = await fetch(
            API_URL + "?limit=2000"
        );

        const datos = await respuesta.json();

        todosLosPokemon = datos.results;

        cantidad.textContent =
            `${todosLosPokemon.length} Pokémon disponibles`;

    } catch (error) {

        cantidad.textContent =
            "No se pudieron cargar los Pokémon.";

        console.error(error);
    }
}


// ==========================================
// BUSCADOR
// ==========================================

input.addEventListener("input", function () {

    const texto = input.value
        .trim()
        .toLowerCase();

    pokemonDetalle.innerHTML = "";

    // Si no escribió nada
    if (texto === "") {

        listaPokemon.innerHTML = "";

        cantidad.textContent =
            `${todosLosPokemon.length} Pokémon disponibles`;

        return;
    }


    // Buscar todos los nombres que contienen las letras
    const resultados = todosLosPokemon.filter(pokemon =>

        pokemon.name
            .toLowerCase()
            .includes(texto)

    );


    mostrarResultados(resultados);
});


// ==========================================
// MOSTRAR RESULTADOS
// ==========================================

function mostrarResultados(resultados) {

    listaPokemon.innerHTML = "";

    cantidad.textContent =
        `${resultados.length} resultado(s)`;


    if (resultados.length === 0) {

        listaPokemon.innerHTML = `
            <div class="sin-resultados">
                <h2>No se encontraron Pokémon</h2>

                <p>
                    Probá con otro nombre.
                </p>
            </div>
        `;

        return;
    }


    resultados.forEach(pokemon => {

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("pokemon-mini");

        tarjeta.innerHTML = `

            <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${obtenerId(pokemon.url)}.png"
                alt="${pokemon.name}"
            >

            <h3>
                ${formatearNombre(pokemon.name)}
            </h3>

        `;


        tarjeta.addEventListener("click", () => {

            obtenerDetalles(pokemon.name);

        });


        listaPokemon.appendChild(tarjeta);

    });
}


// ==========================================
// OBTENER ID DEL POKÉMON
// ==========================================

function obtenerId(url) {

    const partes = url.split("/");

    return partes[partes.length - 2];

}


// ==========================================
// OBTENER DETALLES
// ==========================================

async function obtenerDetalles(nombre) {

    try {

        pokemonDetalle.innerHTML = `
            <p class="cargando">
                Cargando información...
            </p>
        `;


        const respuesta = await fetch(
            API_URL + nombre
        );

        const pokemon = await respuesta.json();

        mostrarDetalles(pokemon);

    } catch (error) {

        pokemonDetalle.innerHTML = `
            <p class="error">
                No se pudo cargar la información.
            </p>
        `;

    }
}


// ==========================================
// MOSTRAR DETALLES
// ==========================================

function mostrarDetalles(pokemon) {

    const imagenes = [

        pokemon.sprites.front_default,
        pokemon.sprites.back_default,
        pokemon.sprites.front_shiny,
        pokemon.sprites.back_shiny

    ].filter(imagen => imagen);


    // TIPOS

    const tipos = pokemon.types.map(tipo => {

        const nombreTipo = tipo.type.name;

        return `
            <span class="tipo ${nombreTipo}">
                ${traducir(nombreTipo)}
            </span>
        `;

    }).join("");


    // ESTADÍSTICAS

    const estadisticas = pokemon.stats.map(stat => {

        return `
            <li>

                <span>
                    ${traducir(stat.stat.name)}
                </span>

                <strong>
                    ${stat.base_stat}
                </strong>

            </li>
        `;

    }).join("");


    // HABILIDADES

    const habilidades = pokemon.abilities.map(habilidad => {

        const nombre = habilidad.ability.name;

        return `
            <li>
                ${traducir(nombre)}
            </li>
        `;

    }).join("");


    pokemonDetalle.innerHTML = `

        <div class="detalle-header">

            <span class="numero">
                #${String(pokemon.id).padStart(3, "0")}
            </span>

            <h2>
                ${formatearNombre(pokemon.name)}
            </h2>

        </div>


        <div class="imagen-principal">

            <img
                src="${pokemon.sprites.front_default}"
                alt="${pokemon.name}"
            >

        </div>


        <section>

            <h3>Imágenes</h3>

            <div class="imagenes">

                ${imagenes.map(imagen => `

                    <img
                        src="${imagen}"
                        alt="${pokemon.name}"
                    >

                `).join("")}

            </div>

        </section>


        <section>

            <h3>Tipo</h3>

            <div class="tipos">

                ${tipos}

            </div>

        </section>


        <section>

            <h3>Estadísticas</h3>

            <ul class="estadisticas">

                ${estadisticas}

            </ul>

        </section>


        <section>

            <h3>Habilidades</h3>

            <ul class="habilidades">

                ${habilidades}

            </ul>

        </section>

    `;

    // Llevar la pantalla hacia los detalles
    pokemonDetalle.scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================
// TRADUCIR
// ==========================================

function traducir(nombre) {

    if (traducciones[nombre]) {

        return traducciones[nombre];

    }

    return formatearNombre(nombre);
}


// ==========================================
// FORMATEAR NOMBRE
// ==========================================

function formatearNombre(nombre) {

    return nombre
        .split("-")
        .map(palabra =>

            palabra.charAt(0).toUpperCase()
            + palabra.slice(1)

        )
        .join(" ");
}


// ==========================================
// INICIAR
// ==========================================

cargarPokemon();
