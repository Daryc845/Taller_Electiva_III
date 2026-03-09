// src/i18n/messages.js
// Diccionarios i18n. La UI debe consumir solo claves (keys) y traducir con t().

export const messages = {
  es: {
    brand: {
      name: "ClassSync",
      subtitle: "Sincronización de clase en tiempo real",
    },

    common: {
      tapToSelect: "Toca para seleccionar",
    },

    status: {
      idle: "Estado: listo.",
      loading: "Procesando…",
      errorPrefix: "Error: ",
      session: "Sesión",
      code: "Código",
      open: "ABIERTA",
      closed: "CERRADA",
      copyCodeAria: "Copiar código",
      codeCopied: "Código copiado",
    },

    activity: {
      title: "Historial de actividad",
      clear: "Limpiar historial",
      empty: "Aún no hay eventos registrados.",
      confirmClear: "Presiona de nuevo para limpiar el historial.",
      cleared: "Historial limpiado.",
      events: {
        role: { selected: "Perfil seleccionado" },
        language: { changed: "Idioma cambiado" },
        theme: { changed: "Tema cambiado" },
        session: {
          opened: "Sesión abierta",
          closed: "Sesión cerrada",
          codeCopied: "Código copiado",
        },
        app: { backHome: "Volvió a inicio" },
      },
      detail: {
        role: "Perfil: {role}",
        language: "Idioma: {lang}",
        theme: "Tema: {theme}",
        code: "Código: {code}",
        from: "Origen: {from}",
      },
      values: {
        teacher: "Docente",
        student: "Estudiante",
        dark: "Oscuro",
        light: "Claro",
      },
    },

    role: {
      title: "Selecciona tu perfil",
      teacher: "Docente",
      teacherDesc:
        "Crea y cierra sesiones, gestiona asistencia y participación.",
      student: "Estudiante",
      studentDesc:
        "Registra asistencia y responde participación en tiempo real.",
      changeProfile: "Cambiar perfil",
      teacherShort: "T",
      studentShort: "S",
    },

    teacher: {
      title: "Panel Docente",
      openSession: "Abrir sesión",
      closeSession: "Cerrar sesión",
      creating: "Creando sesión…",
      closing: "Cerrando sesión…",
      createdOk: "Sesión creada ✅",
      closedOk: "Sesión cerrada ✅",
    },

    student: {
      title: "Panel Estudiante",
      intro: "Ingresa el código para unirte a la sesión.",
      codeLabel: "Código de sesión",
      codePlaceholder: "Ejemplo: 170325",
      join: "Unirme",
      joining: "Uniéndome…",
      joinedOk: "Unido a la sesión: {code} ✅",
      connectedAs: "Conectado a la sesión: {code}",
      notConnected: "Aún no estás conectado a una sesión.",
    },

    theme: { toggleAria: "Cambiar tema" },
    lang: { toggleAria: "Cambiar idioma", es: "ES", en: "EN" },

    errors: {
      tempCreateSession: "Error temporal creando la sesión. Intenta de nuevo.",
      tempCloseSession: "Error temporal cerrando la sesión. Intenta de nuevo.",
      copyFailed: "No se pudo copiar. Copia manualmente.",
      unknown: "Ocurrió un error inesperado.",
      codeEmpty: "El código no puede estar vacío.",
      codeIncomplete: "El código debe tener al menos 6 dígitos.",
      codeNumbersOnly: "El código solo puede contener números.",
      codeInvalid: "Código incorrecto. Verifica con tu docente.",
      validationFailed: "Error del sistema al validar. Intenta de nuevo.",
    },
  },

  en: {
    brand: {
      name: "ClassSync",
      subtitle: "Real-time classroom synchronization",
    },

    common: {
      tapToSelect: "Tap to select",
    },

    status: {
      idle: "Status: ready.",
      loading: "Processing…",
      errorPrefix: "Error: ",
      session: "Session",
      code: "Code",
      open: "OPEN",
      closed: "CLOSED",
      copyCodeAria: "Copy code",
      codeCopied: "Code copied",
    },

    activity: {
      title: "Activity log",
      clear: "Clear history",
      empty: "No events yet.",
      confirmClear: "Press again to clear the history.",
      cleared: "History cleared.",
      events: {
        role: { selected: "Profile selected" },
        language: { changed: "Language changed" },
        theme: { changed: "Theme changed" },
        session: {
          opened: "Session opened",
          closed: "Session closed",
          codeCopied: "Code copied",
        },
        app: { backHome: "Back to home" },
      },
      detail: {
        role: "Profile: {role}",
        language: "Language: {lang}",
        theme: "Theme: {theme}",
        code: "Code: {code}",
        from: "From: {from}",
      },
      values: {
        teacher: "Teacher",
        student: "Student",
        dark: "Dark",
        light: "Light",
      },
    },

    role: {
      title: "Choose your profile",
      teacher: "Teacher",
      teacherDesc:
        "Create and close sessions, manage attendance and participation.",
      student: "Student",
      studentDesc: "Check in attendance and answer participation in real time.",
      changeProfile: "Switch profile",
      teacherShort: "T",
      studentShort: "S",
    },

    teacher: {
      title: "Teacher Panel",
      openSession: "Open session",
      closeSession: "Close session",
      creating: "Creating session…",
      closing: "Closing session…",
      createdOk: "Session created ✅",
      closedOk: "Session closed ✅",
    },

    student: {
      title: "Student Panel",
      intro: "Enter the code to join the session.",
      codeLabel: "Session code",
      codePlaceholder: "Example: 170325",
      join: "Join",
      joining: "Joining…",
      joinedOk: "Joined session: {code} ✅",
      connectedAs: "Connected to session: {code}",
      notConnected: "You are not connected to a session yet.",
    },

    theme: { toggleAria: "Toggle theme" },
    lang: { toggleAria: "Toggle language", es: "ES", en: "EN" },

    errors: {
      tempCreateSession:
        "Temporary error creating the session. Please try again.",
      tempCloseSession:
        "Temporary error closing the session. Please try again.",
      copyFailed: "Couldn't copy. Please copy manually.",
      unknown: "An unexpected error occurred.",
      codeEmpty: "The code cannot be empty.",
      codeIncomplete: "The code must have at least 6 digits.",
      codeNumbersOnly: "The code can only contain numbers.",
      codeInvalid: "Incorrect code. Check with your teacher.",
      validationFailed: "System error while validating. Please try again.",
    },
  },
};
