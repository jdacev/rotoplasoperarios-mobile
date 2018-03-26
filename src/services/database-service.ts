import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SyncProvider } from "../providers/sync/sync";


@Injectable()
export class DatabaseService {

  private database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private platform:Platform,
              private sqlite:SQLite,
              private syncProv:SyncProvider) {
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'rotoplas.db',
        location: 'default'
      })
      .then((db:SQLiteObject)=>{
        this.database = db;

        this.createTables().then(()=>{
          //communicate we are ready!
          this.dbReady.next(true);
        });
      })

    });
  }

  private createTables(){
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
        return this.database.executeSql(
        `DELETE FROM preguntarutina;`,{} )
    }).then(()=>{
        return this.database.executeSql(
        `DELETE FROM tiporutina;`,{} )
    }).then(()=>{
        this.syncProv.getTipoRutinas().subscribe(response => {
           var tipo = response.data;
           for (let i = 0; i < tipo.length; i++) {
             this.database.executeSql(`INSERT INTO tiporutina(sfid, nombre__c)
                   VALUES ('${tipo[i].sfid}', '${tipo[i].nombre__c}');`, {}).then(()=>{
                     // console.log("AGREGUE")
                   }).catch(err =>{
                     console.log("ERROR INSERT: " + JSON.stringify(err));
                   })
           }
           // console.log("TIPORUTINA: " + JSON.stringify(response));
           // this.getTipoRutinas();
        })
    }).then(()=>{
        this.syncProv.getPreguntasRutinas().subscribe(response => {
           var preguntas = response.data;
           for (let i = 0; i < preguntas.length; i++) {
             this.database.executeSql(`INSERT INTO preguntarutina(name, turno__c, rutina__c, sfid, id, tipo_de_respuesta__c, idtiporutina__c, orden__c)
                   VALUES ('${preguntas[i].name}', '${preguntas[i].turno__c}', '${preguntas[i].rutina__c}', '${preguntas[i].sfid}', '${preguntas[i].id}', '${preguntas[i].tipo_de_respuesta__c}', '${preguntas[i].idtiporutina__c}', '${preguntas[i].orden__c}');`, {}).then(()=>{
                     // console.log("AGREGUE")
                   }).catch(err =>{
                     console.log("ERROR INSERT: " + JSON.stringify(err));
                   })
           }
           // console.log("TIPORUTINA: " + JSON.stringify(response));
           // this.getPreguntasRutinas();
        })

    }).then(()=>{
        // return this.database.executeSql(
        // `SELECT * FROM tiporutina;`,{} )
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

  getLists(){}

  getList(id:number){ }
  deleteList(id:number){ }

  getTodosFromList(listId:number){ }
  addTodo(description:string, isImportant:boolean, isDone:boolean, listId:number){ }
  modifyTodo(description:string, isImportant:boolean, isDone:boolean, id:number){ }
  removeTodo(id:number){ }

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
          console.log("DATA TipoRutina:" + JSON.stringify(data.rows.item(i)))
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
          console.log("DATA PreguntaRutina:" + JSON.stringify(data.rows.item(i)))
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

}
