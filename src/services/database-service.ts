import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SyncProvider } from "../providers/sync/sync";
import { TicketsProvider } from "../providers/tickets/tickets";
import { Network } from '@ionic-native/network';



@Injectable()
export class DatabaseService {

  private database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private platform:Platform,
              private sqlite:SQLite,
              private syncProv:SyncProvider,
              private ticketProv: TicketsProvider,
              private network: Network) {
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'rotoplas.db',
        location: 'default'
      })
      .then((db:SQLiteObject)=>{
        console.log("ACA");
        
        this.database = db;
        
        // if(this.network.type != 'none' && this.network.type != 'unknown'){
          this.createTables().then(()=>{
            //communicate we are ready!
            this.dbReady.next(true);
          });
        // }

      })

    });
  }

  resetDb(){
    this.createTables().then(()=>{
      //communicate we are ready!
      this.dbReady.next(true);
    });
  }

  createTables(){
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS oportunidades (
        id_case_sqllite INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        enviaagua__c TEXT,
        origin TEXT,
        idplanta__c TEXT,
        operadorapp__c TEXT,
        reason TEXT,
        descripciondefalla__c TEXT,
        motivodedesestabilizacion__c TEXT,
        accountid TEXT,
        createddate_heroku__c TEXT
      );`
    ,{})
    .then(()=>{
        // this.ticketProv.getMotivosOportunidades().subscribe(response =>{

        // }, error => {
        //   console.log("ERROR en getmotivos" + JSON.stringify(error));
        // })
      return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS motivooportunidad (
        sfid TEXT PRIMARY KEY,
        name TEXT
        );`,{} )
    
    }).then(()=>{

      return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS descripciondefalla (
        sfid TEXT PRIMARY KEY,
        name TEXT,
        motivooportunidadc__c TEXT
        );`,{} )
    }).then(()=>{

      return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS motivodedesestabilizacion (
        sfid TEXT PRIMARY KEY,
        name TEXT,
        descripcionfalla__c TEXT
        );`,{} )

    }).then(()=>{

      return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS tiporutina (
        sfid TEXT PRIMARY KEY,
        nombre__c TEXT
        );`,{} )
        
    }).then(()=>{

      return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS tiporutina (
        sfid TEXT PRIMARY KEY,
        nombre__c TEXT
        );`,{} )
        
    }).then(()=>{
      return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS preguntarutina (
        sfid TEXT PRIMARY KEY,
        name TEXT,
        turno__c TEXT,
        rutina__c TEXT,
        id INTEGER,
        tipo_de_respuesta__c TEXT,
        orden__c INTEGER,
        idtiporutina__c TEXT
        );`,{} )
    }).then(()=>{
      return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS rutinas (
        id_rutina_sqllite INTEGER PRIMARY KEY AUTOINCREMENT,
        observacion__c TEXT,
        idplanta__c TEXT,
        usuarioapp__c TEXT,
        idtiporutina__c TEXT,
        rutaimagen__c TEXT,
        createddate_heroku__c TEXT,
        FOREIGN KEY(idtiporutina__c) REFERENCES tiporutina(sfid)
        );`,{} )
    }).then(()=>{
        return this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS actividadrutina (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          id_rutinas_heroku__c INTEGER,
          id_pregunta_rutina__c INTEGER,
          valor_si_no__c INTEGER,
          valornumerico__c INTEGER,
          observaciones__c TEXT
          );`,{} )
    }).then(()=>{
      if(this.network.type != 'none' && this.network.type != 'unknown'){
        return this.database.executeSql(
        `DELETE FROM preguntarutina;`,{} ).then(()=>{
          return this.database.executeSql(
            `DELETE FROM tiporutina;`,{} )
        }).then(()=>{
            return this.database.executeSql(
            `DELETE FROM motivooportunidad;`,{} )
          }).then(()=>{
            return this.database.executeSql(
            `DELETE FROM descripciondefalla;`,{} )
        }).then(()=>{
            return this.database.executeSql(
            `DELETE FROM motivodedesestabilizacion;`,{} )
        }).then(()=>{
          
          this.insertarDatos();
        })
      }
    }).then(()=>{
        
      
    }).catch((err)=>console.log("error detected creating tables" + JSON.stringify(err)));
  }

  private isReady(){
    return new Promise((resolve, reject) =>{
      //if dbReady is true, resolve
      if(this.dbReady.getValue()){
        resolve();
      }
      //otherwise, wait to resolve until dbReady returns true
      else{
        this.dbReady.subscribe((ready)=>{
          if(ready){
            resolve();
          }
        });
      }
    })
  }

  crearOportunidad(data){
    // console.log("Creando oportunidad");
    return this.isReady()
    .then(()=>{
      // console.log("Adentro de READY");
      // console.log("data: " + JSON.stringify(data));
      return this.database.executeSql(`INSERT INTO oportunidades(description, enviaagua__c, origin, idplanta__c, operadorapp__c, reason, descripciondefalla__c, motivodedesestabilizacion__c, accountid, createddate_heroku__c)
            VALUES ('${data.description}', '${data.enviaagua__c}', '${data.origin}', '${data.idplanta__c}', '${data.operadorapp__c}', '${data.reason}', '${data.descripciondefalla__c}', '${data.motivodedesestabilizacion__c}', '${data.accountid}', '${data.createddate_heroku__c}');`, {}).then((result)=>{
        if(result.insertId){
          return this.getOportunidad(result.insertId);
        }
        // console.log("result: " + JSON.stringify(result));
      }).catch(er => {
        console.log("ERROR:" + JSON.stringify(er));
      })
    });
  }

  getOportunidades(){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql("SELECT * from oportunidades", [])
      .then((data)=>{
        let oportunidades = [];
        for(let i=0; i<data.rows.length; i++){
          oportunidades.push(data.rows.item(i));
        }
        return oportunidades;
      })
    })
  }



  getTipoRutinas(){
    this.database.executeSql("SELECT * from tiporutina", [])
      .then((data)=>{
        let tipo = [];
        for(let i=0; i<data.rows.length; i++){
          // tipo.push(data.rows.item(i));
          //console.log("DATA TipoRutina:" + JSON.stringify(data.rows.item(i)))
        }
        // return oportunidades;
    })
  }

  getPreguntasRutinas(){
    this.database.executeSql("SELECT * from preguntarutina", [])
      .then((data)=>{
        let tipo = [];
        for(let i=0; i<data.rows.length; i++){
          // tipo.push(data.rows.item(i));
          // console.log("DATA PreguntaRutina:" + JSON.stringify(data.rows.item(i)))
        }
        // return oportunidades;
    })
  }

  getOportunidad(id:number){
   return this.isReady()
   .then(()=>{
     return this.database.executeSql(`SELECT * FROM oportunidades WHERE id_case_sqllite = ${id}`, [])
     .then((data)=>{
       if(data.rows.length){
         return data.rows.item(0);
       }
       return null;
     })
   })
 }

 getMotivosOportunidadesOffline(){
   this.dbReady.next(true);
   return this.isReady()
   .then(()=>{
    console.log("EN EL SELECT DE GETMOTIVOFFLINE")
    return this.database.executeSql("SELECT * from motivooportunidad", [])
      .then((data)=>{
        // console.log("DATA: "+ JSON.stringify(data));
        
        let motivos = [];
        for(let i=0; i<data.rows.length; i++){
          motivos.push(data.rows.item(i));
        }
        console.log("DATA: " + JSON.stringify(motivos))
        return motivos;
      })
   });
   
  }

  getDescripcionesFallaOffline(sfid:string){
    // console.log("EN EL SELECT DE GETMOTIVOFFLINE. SFID: " + sfid)
    return this.database.executeSql(`SELECT * FROM descripciondefalla WHERE motivooportunidadc__c = '${sfid}'`, [])
      .then((data)=>{
        // console.log("DATA: "+ JSON.stringify(data));
        
        let desc = [];
        for(let i=0; i<data.rows.length; i++){
          desc.push(data.rows.item(i));
        }
        // console.log("DATA: " + JSON.stringify(desc))
        return desc;
      })
  }

  getMotivosDesestabilizacionOffline(sfid:string){
    // console.log("EN EL SELECT DE GETMOTIVOFFLINE")
    return this.database.executeSql(`SELECT * FROM motivodedesestabilizacion WHERE descripcionfalla__c = '${sfid}'`, [])
      .then((data)=>{
        // console.log("DATA: "+ JSON.stringify(data));
        
        let motivos = [];
        for(let i=0; i<data.rows.length; i++){
          motivos.push(data.rows.item(i));
        }
        return motivos;
      })
  }

 insertarDatos(){
  this.syncProv.getTipoRutinas().subscribe(response => {
    var tipo = response.data;
      for (let i = 0; i < tipo.length; i++) {
        this.database.executeSql(`INSERT INTO tiporutina(sfid, nombre__c)
              VALUES ('${tipo[i].sfid}', '${tipo[i].nombre__c}');`, {}).then(()=>{
                console.log("AGREGUE tipoRutina")
              }).catch(err =>{
                console.log("ERROR INSERT: " + JSON.stringify(err));
              })
      }
      // console.log("TIPORUTINA: " + JSON.stringify(response));
      // this.getTipoRutinas();
  });

  this.syncProv.getPreguntasRutinas().subscribe(response => {
    var preguntas = response.data;
    for (let i = 0; i < preguntas.length; i++) {
      this.database.executeSql(`INSERT INTO preguntarutina(name, turno__c, rutina__c, sfid, id, tipo_de_respuesta__c, idtiporutina__c, orden__c)
            VALUES ('${preguntas[i].name}', '${preguntas[i].turno__c}', '${preguntas[i].rutina__c}', '${preguntas[i].sfid}', '${preguntas[i].id}', '${preguntas[i].tipo_de_respuesta__c}', '${preguntas[i].idtiporutina__c}', '${preguntas[i].orden__c}');`, {}).then(()=>{
              console.log("AGREGUE preg. rutina")
            }).catch(err =>{
              console.log("ERROR INSERT: " + JSON.stringify(err));
            })
    }
    // console.log("TIPORUTINA: " + JSON.stringify(response));
    // this.getPreguntasRutinas();
  });

  this.ticketProv.getMotivosOportunidades().subscribe(response =>{
      var motivos = response.data;
      for (let i = 0; i < motivos.length; i++) {
        // console.log("Voy a insertar: " + JSON.stringify(motivos[i]));
        
        this.database.executeSql(`INSERT INTO motivooportunidad(sfid, name)
              VALUES ('${motivos[i].sfid}', '${motivos[i].name}');`, {}).then(()=>{
                console.log("AGREGUE MOTIVO")
              }).catch(err =>{
                console.log("ERROR INSERT MOTIVOS: " + JSON.stringify(err));
              })
      }
      // console.log("MOTIVOS: " + JSON.stringify(motivos));
    }, error => {
      console.log("ERROR en getmotivos" + JSON.stringify(error));
    });

  this.ticketProv.getTodasDescripcionesFallas().subscribe(response =>{
    var desc = response.data;
    for (let i = 0; i < desc.length; i++) {
      this.database.executeSql(`INSERT INTO descripciondefalla(sfid, name, motivooportunidadc__c)
            VALUES ('${desc[i].sfid}', '${desc[i].name}', '${desc[i].motivooportunidadc__c}');`, {}).then(()=>{
              console.log("AGREGUE Descrip. de falla")
            }).catch(err =>{
              console.log("ERROR INSERT: " + JSON.stringify(err));
            })
    }
    // console.log("Desc. Fallas: " + JSON.stringify(desc));
  }, error => {
    console.log("ERROR en getdescripcionfallas" + JSON.stringify(error));
  });

  this.ticketProv.getTodasMotivosDesestabilizaciones().subscribe(response =>{
    console.log("MOTIVOS DESEST: " + JSON.stringify(response));
    var motivoDesest = response.data;
    for (let i = 0; i < motivoDesest.length; i++) {
      this.database.executeSql(`INSERT INTO motivodedesestabilizacion(sfid, name, descripcionfalla__c)
            VALUES ('${motivoDesest[i].sfid}', '${motivoDesest[i].name}', '${motivoDesest[i].descripcionfalla__c}');`, {}).then(()=>{
              console.log("AGREGUE motivo desestab.")
            }).catch(err =>{
              console.log("ERROR INSERT: " + JSON.stringify(err));
            })
    }
    // console.log("Motivos Desestab.: " + JSON.stringify(response));
  }, error => {
    console.log("ERROR en getmotivosdesestabilizacion" + JSON.stringify(error));
  });


 }
 

}
