const moduleRaid = function () {
  moduleRaid.mID  = Math.random().toString(36).substring(7);
  moduleRaid.mObj = {};

  moduleRaid.isComet = parseInt(window.Debug?.VERSION?.split(".")?.[1]) >= 3000;

  fillModuleArray = function() {
    if (parseFloat(window.Debug?.VERSION) < 2.3) {
    (window.webpackChunkbuild || window.webpackChunkwhatsapp_web_client).push([
      [moduleRaid.mID], {}, function(e) {
        Object.keys(e.m).forEach(function(mod) {
          moduleRaid.mObj[mod] = e(mod);
        })
      }
    ]);
  } else {
    let modules = self.require('__debug').modulesMap;
    Object.keys(modules).filter(e => e.includes("WA")).forEach(function (mod) {
        let modulos = modules[mod];
        if (modulos) {
          moduleRaid.mObj[mod] = {
                default: modulos.defaultExport,
                factory: modulos.factory,
                ...modulos
            };
            if (Object.keys(moduleRaid.mObj[mod].default).length == 0) {
                try {
                    self.ErrorGuard.skipGuardGlobal(true);
                    Object.assign(moduleRaid.mObj[mod], self.importNamespace(mod));
                } catch (e) {
                }
            }
        }
    })
  }
  }

  fillModuleArray();


  get = function get (id) {
    return moduleRaid.mObj[id]
  }

  findModule = function findModule (query) {
    results = [];
    modules = Object.keys(moduleRaid.mObj);

    modules.forEach(function(mKey) {
      mod = moduleRaid.mObj[mKey];

      if (typeof mod !== 'undefined') {
        if (typeof query === 'string') {
          if (typeof mod.default === 'object') {
            for (key in mod.default) {
              if (key == query) results.push(mod);
            }
          }

          for (key in mod) {
            if (key == query) results.push(mod);
          }
        } else if (typeof query === 'function') { 
          if (query(mod)) {
            results.push(mod);
          }
        } else {
          throw new TypeError('findModule can only find via string and function, ' + (typeof query) + ' was passed');
        }
      }
    })

    return results;
  }

  return {
    modules: moduleRaid.mObj,
    constructors: moduleRaid.cArr,
    findModule: findModule,
    get: get
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = moduleRaid;
} else {
  window.mR = moduleRaid();
}



const initInterval = setInterval(() => {
  if ((window.webpackChunkbuild || window.webpackChunkwhatsapp_web_client)) {
    const momentModule = window.mR.findModule(m => 
      m.default && m.default.defineLocale && m.default.locale
    )[0];
    
    if (momentModule && momentModule.default) {
      const userLocale = navigator.language || 'en';
      momentModule.default.locale(userLocale);
      
      const originalDefineLocale = momentModule.default.defineLocale;
      momentModule.default.defineLocale = function(locale, config) {
        if (locale === 'pt-br') return;
        return originalDefineLocale.call(this, locale, config);
      };
    }
    window.mR = moduleRaid();
    window.Store = Object.assign({}, (!window.mR.findModule((m) => (m.Call && m.Chat)).length ? window.mR.findModule((m) => ( m.default && m.default.Chat))[0].default : window.mR.findModule((m) => (m.Call && m.Chat))[0]));
    clearInterval(initInterval);
  }
}, 1000);

const members = [
  { name: "John Doe", phone: "1234567890" },
  { name: "Jane Smith", phone: "2345678901" },
  { name: "Alice Johnson", phone: "3456789012" },
  { name: "Bob Brown", phone: "4567890123" }
];

window.addEventListener('message', (e) => {
  if (e.data.export) {
    const votes = Store.PollVote.getModelsArray().filter(
      x => e.data.export.includes(x.__x_parentMsgKey._serialized)
    );
    
    const pollParticipants = votes.map(x => x.__x_sender.user);
    
    const missingMembers = members.filter(
      member => !pollParticipants.includes(member.phone)
    );
    
    console.log("Missing Members:", missingMembers);

    let missingMembersCSV = "Name,Phone\n" + missingMembers.map(
      member => `"${member.name}","${member.phone}"`
    ).join("\n");
    const a = document.createElement("a");
    a.href = 'data:text/csv; charset=utf-8,' + encodeURIComponent("\uFEFF" + missingMembersCSV);
    a.download = "missing_members.csv";
    a.click();
  }
});

