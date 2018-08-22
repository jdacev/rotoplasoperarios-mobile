import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SyncProvider } from "../providers/sync/sync";
import { TicketsProvider } from "../providers/tickets/tickets";
import { RutinasProvider } from "../providers/rutinas/rutinas";
import { Network } from '@ionic-native/network';
import { AuthService } from "../providers/auth-service/auth-service";
import { URL_SERVICIOS } from "../config/url.services";
import { File } from '@ionic-native/file';
import { AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';


@Injectable()
export class DatabaseService {

  origen: string;
  images: any = [];
  private database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private platform: Platform,
    private sqlite: SQLite,
    private syncProv: SyncProvider,
    private ticketProv: TicketsProvider,
    private rutinasProv: RutinasProvider,
    private network: Network,
    public authservice: AuthService,
    public http: Http,
    private alertCtrl: AlertController,
    public file: File,
    public transfer: FileTransfer) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'rotoplas.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          // console.log("ACA");

          this.database = db;

          // if(this.network.type != 'none' && this.network.type != 'unknown'){
          this.createTables().then(() => {
            //communicate we are ready!
            this.actualizarTabla();
            this.dbReady.next(true);
          });
          // }

        })

    });
  }

  resetDb() {
    this.createTables().then(() => {
      //communicate we are ready!
      this.dbReady.next(true);
    });
  }

  async actualizarTabla() {
    try {
      for (let i = 1; i <= this.authservice.AuthToken.variables.fotos_por_actividad_rutina__c; i++) {
        let sql =
          await this.database.executeSql(`ALTER TABLE actividadrutina ADD COLUMN foto${i}__c TEXT`, {});
      }
    } catch (e) {
      console.log('error al agregar columna fotos..', e);
    }
  }

  createTables() {
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
      , {})
      .then(() => {
        return this.database.executeSql(
          `CREATE TABLE IF NOT EXISTS motivooportunidad (
        sfid TEXT PRIMARY KEY,
        name TEXT
        );`, {})

      }).then(() => {

        return this.database.executeSql(
          `CREATE TABLE IF NOT EXISTS descripciondefalla (
        sfid TEXT PRIMARY KEY,
        name TEXT,
        motivooportunidadc__c TEXT
        );`, {})
      }).then(() => {

        return this.database.executeSql(
          `CREATE TABLE IF NOT EXISTS motivodedesestabilizacion (
        sfid TEXT PRIMARY KEY,
        name TEXT,
        descripcionfalla__c TEXT
        );`, {})

      }).then(() => {

        return this.database.executeSql(
          `CREATE TABLE IF NOT EXISTS tiporutina (
        sfid TEXT PRIMARY KEY,
        nombre__c TEXT
        );`, {})

      }).then(() => {
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
        );`, {})
      }).then(() => {
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
        );`, {})
      }).then(() => {
        return this.database.executeSql(
          `CREATE TABLE IF NOT EXISTS actividadrutina (
          id_rutina_sqllite INTEGER,
          id_pregunta_rutina__c INTEGER,
          valor_si_no__c INTEGER,
          valornumerico__c INTEGER,
          observaciones__c TEXT
          );`, {})
      }).then(() => {
        if (this.network.type != 'none' && this.network.type != 'unknown') {
          return this.database.executeSql(
            `DELETE FROM preguntarutina;`, {}).then(() => {
              return this.database.executeSql(
                `DELETE FROM tiporutina;`, {})
            }).then(() => {
              return this.database.executeSql(
                `DELETE FROM motivooportunidad;`, {})
            }).then(() => {
              return this.database.executeSql(
                `DELETE FROM descripciondefalla;`, {})
            }).then(() => {
              return this.database.executeSql(
                `DELETE FROM motivodedesestabilizacion;`, {})
            }).then(() => {

              this.insertarDatos();
            })
        }
      }).then(() => {


      }).catch((err) => console.log("error detected creating tables" + JSON.stringify(err)));
  }

  private isReady() {
    return new Promise((resolve, reject) => {
      //if dbReady is true, resolve
      if (this.dbReady.getValue()) {
        resolve();
      }
      //otherwise, wait to resolve until dbReady returns true
      else {
        this.dbReady.subscribe((ready) => {
          if (ready) {
            resolve();
          }
        });
      }
    })
  }

  crearOportunidad(data) {
    // console.log("Creando oportunidad");
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`INSERT INTO oportunidades(description, enviaagua__c, origin, idplanta__c, operadorapp__c, reason, descripciondefalla__c, motivodedesestabilizacion__c, accountid, createddate_heroku__c)
            VALUES ('${data.description}', '${data.enviaagua__c}', '${data.origin}', '${data.idplanta__c}', '${data.operadorapp__c}', '${data.reason}', '${data.descripciondefalla__c}', '${data.motivodedesestabilizacion__c}', '${data.accountid}', '${data.createddate_heroku__c}');`, {}).then((result) => {
            if (result.insertId) {
              return this.getOportunidad(result.insertId);
            }
            // console.log("result: " + JSON.stringify(result));
          }).catch(er => {
            console.log("ERROR:" + JSON.stringify(er));
          })
      });
  }

  crearRutinaOffline(data) {
    // return this.isReady()
    // .then(()=>{
    return this.database.executeSql(`INSERT INTO rutinas(observacion__c, idplanta__c, usuarioapp__c, idtiporutina__c, rutaimagen__c, createddate_heroku__c)
            VALUES ('${data.observacion__c}', '${data.idplanta__c}', '${data.usuarioapp__c}', '${data.idtiporutina__c}', '${data.rutaimagen__c}', '${data.createddate_heroku__c}');`, {}).then((result) => {
        if (result.insertId) {
          // console.log("Result Rutina: " + result.insertId);
          // console.log("CREE LA RUTINA.");
          this.crearActividadRutinaOffline(result.insertId, data.actividadrutina__c);
          return result.insertId;
        }
        // console.log("result: " + JSON.stringify(result));
      })
      .catch(er => {
        console.log("ERROR:" + JSON.stringify(er));
      })
    // });
  }

  crearActividadRutinaOffline(id_rutinas_heroku__c, actividadesRutina) {
    // console.log("Por agregar ActividadesRutina: " + JSON.stringify(actividadesRutina));

    for (let i in actividadesRutina) {
      let sqlFotosInsert = '';
      let sqlFotosValues = '';
      for (let x = 1; x <= this.authservice.AuthToken.variables.fotos_por_actividad_rutina__c; x++) {
        if (x === 1) {
          sqlFotosInsert += ',';
          sqlFotosValues += ',';
        }
        sqlFotosInsert += `foto${x}__c`
        sqlFotosValues += `'${actividadesRutina[i]['foto' + x + '__c']}'`;
        if (x !== this.authservice.AuthToken.variables.fotos_por_actividad_rutina__c) {
          sqlFotosInsert += ',';
          sqlFotosValues += ',';
        }
      }

      let sql = `
        INSERT INTO actividadrutina (
          id_rutina_sqllite,
          id_pregunta_rutina__c,
          valor_si_no__c, 
          valornumerico__c, 
          observaciones__c`;
      sql += sqlFotosInsert;

      sql += ')values(';

      sql += `'${id_rutinas_heroku__c}',
              '${actividadesRutina[i].id_pregunta_rutina__c}',
              '${actividadesRutina[i].valor_si_no__c ? 1 : 0}',
              '${!actividadesRutina[i].valornumerico__c ? null : actividadesRutina[i].valornumerico__c}',
              '${actividadesRutina[i].observaciones__c}'`;

      sql += sqlFotosValues;
      sql += ')';

      this.database.executeSql(sql, {}).then((result) => {
      }, error => {
        console.log("ERROR AGREGANDO:" + JSON.stringify(error));
      })
    }

  }

  getOportunidades() {
    return this.isReady()
      .then(() => {
        return this.database.executeSql("SELECT * from oportunidades", [])
          .then((data) => {
            let oportunidades = [];
            for (let i = 0; i < data.rows.length; i++) {
              oportunidades.push(data.rows.item(i));
            }
            return oportunidades;
          })
      })
  }

  getRutinaOfflineByRutina(idRutina) {
    var rutina;
    return this.getRutinaFromSQliteByRutina(idRutina).then(data => {
      rutina = data;
      return this.agregarActividades(rutina, function (rutina, actividades) {
        rutina.actividadrutina__c = actividades;
      });
    });
  }

  getRutinasOffline() {
    var rutinas;
    return this.getRutinasUsuarioOffline().then(data => {
      rutinas = data;
      return this.agregarActividades(rutinas, function (rutina, actividades) {
        rutina.actividadrutina__c = actividades;
      });
    });
  }

  agregarActividades(rutinas, callback) {
    var actividades = [];
    for (let i = 0; i < rutinas.length; i++) {
      return this.getRespuestasActividadesOffline(rutinas[i].id_rutina_sqllite).then((actividades) => {
        for (let i = 0; i < actividades.length; i++) {
          if (actividades[i].valor_si_no__c == 1) {
            actividades[i].valor_si_no__c = true;
          } else {
            actividades[i].valor_si_no__c = false;
          }

        }
        callback(rutinas[i], actividades)
      }).then(() => {
        return rutinas;
      })
    }
  }


  getRutinaFromSQliteByRutina(idRutina) {
    return this.isReady()
      .then(() => {

        return this.database.executeSql(`SELECT * FROM rutinas WHERE id_rutina_sqllite = '${idRutina}'`, [])
          .then((data) => {
            let rutina = [];
            for (let i = 0; i < data.rows.length; i++) {
              rutina.push(data.rows.item(i));
            }
            return rutina;
          })
      })
  }

  getRutinasUsuarioOffline() {
    return this.isReady()
      .then(() => {
        var idPlanta = this.authservice.AuthToken.planta.sfid;
        var idOperador = this.authservice.AuthToken.usuario.sfid;
        return this.database.executeSql(`SELECT rutinas.id_rutina_sqllite, preguntarutina.turno__c, tiporutina.nombre__c, rutinas.rutaimagen__c, rutinas.observacion__c, rutinas.idtiporutina__c, rutinas.usuarioapp__c, rutinas.idplanta__c, rutinas.createddate_heroku__c FROM rutinas INNER JOIN tiporutina ON (rutinas.idtiporutina__c = tiporutina.sfid) INNER JOIN actividadrutina ON (rutinas.id_rutina_sqllite = actividadrutina.id_rutina_sqllite) INNER JOIN preguntarutina ON (actividadrutina.id_pregunta_rutina__c = preguntarutina.sfid) WHERE rutinas.idplanta__c = '${idPlanta}' AND rutinas.usuarioapp__c = '${idOperador}' GROUP BY rutinas.id_rutina_sqllite, rutinas.rutaimagen__c, rutinas.observacion__c, rutinas.idtiporutina__c, rutinas.usuarioapp__c, rutinas.idplanta__c, rutinas.createddate_heroku__c, preguntarutina.turno__c ORDER BY rutinas.createddate_heroku__c DESC`, [])
          .then((data) => {
            // console.log("GET DE RUTINA 2 ");
            let rutinas = [];
            for (let i = 0; i < data.rows.length; i++) {
              rutinas.push(data.rows.item(i));
            }
            return rutinas;
          })
      })
  }

  getRespuestasActividadesOffline(idRutina) {
    return this.database.executeSql(`
    SELECT 
      preguntarutina.name, 
      actividadrutina.* 
    FROM rutinas INNER JOIN 
      actividadrutina ON (rutinas.id_rutina_sqllite = actividadrutina.id_rutina_sqllite) INNER JOIN 
      preguntarutina ON (actividadrutina.id_pregunta_rutina__c = preguntarutina.sfid) 
    WHERE rutinas.id_rutina_sqllite = '${idRutina}'`, [])
      .then((data) => {
        let respuestas = [];
        for (let i = 0; i < data.rows.length; i++) {
          respuestas.push(data.rows.item(i));
        }
        return respuestas;
      })
  }



  getTipoRutinasOffline() {
    return this.database.executeSql("SELECT * from tiporutina", [])
      .then((data) => {
        let tipo = [];
        for (let i = 0; i < data.rows.length; i++) {
          tipo.push(data.rows.item(i));
        }
        return tipo;
      })
  }

  getPreguntasRutinas() {
    this.database.executeSql("SELECT * from preguntarutina", [])
      .then((data) => {
        let tipo = [];
        for (let i = 0; i < data.rows.length; i++) {
        }
      })
  }

  getPreguntasTipoRutinaOffline(idTipoRutina: string, turno: string) {
    return this.database.executeSql(`SELECT * from preguntarutina where idtiporutina__c = '${idTipoRutina}' and turno__c = '${turno}' order by orden__c`, [])
      .then((data) => {
        let tipo = [];
        for (let i = 0; i < data.rows.length; i++) {
          tipo.push(data.rows.item(i));
        }
        return tipo;
      })
  }

  getOportunidad(id: number) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql(`SELECT * FROM oportunidades WHERE id_case_sqllite = ${id}`, [])
          .then((data) => {
            if (data.rows.length) {
              return data.rows.item(0);
            }
            return null;
          })
      })
  }

  getMotivosOportunidadesOffline() {
    this.dbReady.next(true);
    return this.isReady()
      .then(() => {
        // console.log("EN EL SELECT DE GETMOTIVOFFLINE")
        return this.database.executeSql("SELECT * from motivooportunidad", [])
          .then((data) => {
            // console.log("DATA: "+ JSON.stringify(data));

            let motivos = [];
            for (let i = 0; i < data.rows.length; i++) {
              motivos.push(data.rows.item(i));
            }
            // console.log("DATA: " + JSON.stringify(motivos))
            return motivos;
          })
      });

  }

  getDescripcionesFallaOffline(sfid: string) {
    // console.log("EN EL SELECT DE GETMOTIVOFFLINE. SFID: " + sfid)
    return this.database.executeSql(`SELECT * FROM descripciondefalla WHERE motivooportunidadc__c = '${sfid}'`, [])
      .then((data) => {
        // console.log("DATA: "+ JSON.stringify(data));

        let desc = [];
        for (let i = 0; i < data.rows.length; i++) {
          desc.push(data.rows.item(i));
        }
        // console.log("DATA: " + JSON.stringify(desc))
        return desc;
      })
  }

  getMotivosDesestabilizacionOffline(sfid: string) {
    // console.log("EN EL SELECT DE GETMOTIVOFFLINE")
    return this.database.executeSql(`SELECT * FROM motivodedesestabilizacion WHERE descripcionfalla__c = '${sfid}'`, [])
      .then((data) => {
        // console.log("DATA: "+ JSON.stringify(data));

        let motivos = [];
        for (let i = 0; i < data.rows.length; i++) {
          motivos.push(data.rows.item(i));
        }
        return motivos;
      })
  }

  insertarDatos() {
    this.syncProv.getTipoRutinas().subscribe(response => {
      var tipo = response.data;
      for (let i = 0; i < tipo.length; i++) {
        this.database.executeSql(`INSERT INTO tiporutina(sfid, nombre__c)
              VALUES ('${tipo[i].sfid}', '${tipo[i].nombre__c}');`, {}).then(() => {
          }).catch(err => {
            console.log("ERROR INSERT: " + JSON.stringify(err));
          })
      }
    });

    this.syncProv.getPreguntasRutinas().subscribe(response => {
      var preguntas = response.data;
      for (let i = 0; i < preguntas.length; i++) {
        this.database.executeSql(`INSERT INTO preguntarutina(name, turno__c, rutina__c, sfid, id, tipo_de_respuesta__c, idtiporutina__c, orden__c)
            VALUES ('${preguntas[i].name}', '${preguntas[i].turno__c}', '${preguntas[i].rutina__c}', '${preguntas[i].sfid}', '${preguntas[i].id}', '${preguntas[i].tipo_de_respuesta__c}', '${preguntas[i].idtiporutina__c}', '${preguntas[i].orden__c}');`, {}).then(() => {
          }).catch(err => {
            console.log("ERROR INSERT: " + JSON.stringify(err));
          })
      }
    });

    this.ticketProv.getMotivosOportunidades().subscribe(response => {
      var motivos = response.data;
      for (let i = 0; i < motivos.length; i++) {
        // console.log("Voy a insertar: " + JSON.stringify(motivos[i]));

        this.database.executeSql(`INSERT INTO motivooportunidad(sfid, name)
              VALUES ('${motivos[i].sfid}', '${motivos[i].name}');`, {}).then(() => {
            // console.log("AGREGUE MOTIVO")
          }).catch(err => {
            console.log("ERROR INSERT MOTIVOS: " + JSON.stringify(err));
          })
      }
      // console.log("MOTIVOS: " + JSON.stringify(motivos));
    }, error => {
      console.log("ERROR en getmotivos" + JSON.stringify(error));
    });

    this.ticketProv.getTodasDescripcionesFallas().subscribe(response => {
      var desc = response.data;
      for (let i = 0; i < desc.length; i++) {
        this.database.executeSql(`INSERT INTO descripciondefalla(sfid, name, motivooportunidadc__c)
            VALUES ('${desc[i].sfid}', '${desc[i].name}', '${desc[i].motivooportunidadc__c}');`, {}).then(() => {
            // console.log("AGREGUE Descrip. de falla")
          }).catch(err => {
            console.log("ERROR INSERT: " + JSON.stringify(err));
          })
      }
      // console.log("Desc. Fallas: " + JSON.stringify(desc));
    }, error => {
      console.log("ERROR en getdescripcionfallas" + JSON.stringify(error));
    });

    this.ticketProv.getTodasMotivosDesestabilizaciones().subscribe(response => {
      // console.log("MOTIVOS DESEST: " + JSON.stringify(response));
      var motivoDesest = response.data;
      for (let i = 0; i < motivoDesest.length; i++) {
        this.database.executeSql(`INSERT INTO motivodedesestabilizacion(sfid, name, descripcionfalla__c)
            VALUES ('${motivoDesest[i].sfid}', '${motivoDesest[i].name}', '${motivoDesest[i].descripcionfalla__c}');`, {}).then(() => {
            // console.log("AGREGUE motivo desestab.")
          }).catch(err => {
            console.log("ERROR INSERT: " + JSON.stringify(err));
          })
      }
      // console.log("Motivos Desestab.: " + JSON.stringify(response));
    }, error => {
      console.log("ERROR en getmotivosdesestabilizacion" + JSON.stringify(error));
    });


  }


  showAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [{
        text: 'Ok'
      }]
    });
    alert.present();
  }

  syncRutinas() {
    this.postRutinas(this.uploadRutinasImages);
  }

  uploadRutinasImages(file, origen, subDir, rutina, rutinasProv, transfer, database, AuthToken) {
    console.log("En update por listar archivos");

    file.listDir(origen, subDir).then(data => {
      var images = [];

      data.forEach(imagen => {
        images.push(imagen.nativeURL);
        console.log("Agregué imagen: " + JSON.stringify(imagen));

      });

      console.log("POR CREAR RUTINA: " + JSON.stringify(rutina));

      rutinasProv.crearRutina(rutina).then(id => {

        console.log("Entré a crear rutina online: " + JSON.stringify(rutina));
        console.log("Id generado creado: " + id);

        database.executeSql(
          `DELETE FROM rutinas WHERE id_rutina_sqllite = '${rutina.id_rutina_sqllite}';`, {});

        database.executeSql(
          `DELETE FROM actividadrutina WHERE id_rutina_sqllite = '${rutina.id_rutina_sqllite}';`, {});

        console.log("BORRE rutina: " + rutina.id_rutina_sqllite);

        if (images.length > 0) {

          let options: FileUploadOptions = {
            fileKey: 'azureupload',
            // fileName: fileName,
            chunkedMode: false,
            mimeType: "image/jpeg",
            // mimeType: 'multipart/form-data',
            // headers: {},
            params: { 'containername': "rutina" + id.toString() }
          }

          const fileTransfer: FileTransferObject = transfer.create();
          console.log("por subir imagenes");

          images.forEach(image => {
            options.fileName = image.substring(image.lastIndexOf('/') + 1, image.length);

            console.log("En foreach, imagen: " + image);
            console.log('ver actividades de la rutina:', rutina.actividadrutina__c);
            let actividadMeta = rutina.actividadrutina__c.filter(actividad => {
              for (let x = 1; x <= AuthToken.variables.fotos_por_actividad_rutina__c; x++) {
                if (options.fileName === actividad[`foto${x}__c`])
                  return actividad;
              }
            });
            console.log("=== mi foto ===", options.fileName);
            console.log("=== mi actividad ===", actividadMeta);

            let metadata = {
              id: '-',
              idtiporutina__c: rutina.idtiporutina__c,
              actividad: actividadMeta[0].name.normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
              orden__c: '-',
              rutina__c: '-',
              sfid: actividadMeta[0].id_pregunta_rutina__c,
              tipo_de_respuesta__c: '-',
              turno__c: '-',
              valornumerico__c: actividadMeta[0].valornumerico__c || '-',
              valor_si_no__c: actividadMeta[0].valor_si_no__c || '-',
              observacion: actividadMeta[0].observaciones__c.normalize('NFD').replace(/[\u0300-\u036f]/g, "") || '-',
              latitude: '-',
              longitude: '-',
              planta_id: rutina.idplanta__c.sfid,
              planta: AuthToken.planta.name,
              enlinea: 'OFF LINE'
            };

            options.params.metadata = metadata;

            fileTransfer.upload(image, URL_SERVICIOS + '/azurecrearcontenedorsubirimagen', options)
              .then((data) => {
                console.log("SUBI CORRECTAMENTE EL ARCHIVO");

              }, (err) => {
                console.log('Error:' + JSON.stringify(err));
              });
          })
        }
      }, error => {
        console.log("Error creando rutina: " + JSON.stringify(error));

      });
    }, error => {
      console.log("falla file.listDir: " + JSON.stringify(error));
    });
  }

  postRutinas(uploadRutinasImages) {
    this.origen = this.file.dataDirectory + 'rutinas/';

    var rutinasLite = this.database.executeSql(` SELECT * FROM rutinas `, [])
      .then((data) => {
        let rutinasLite = [];
        for (let i = 0; i < data.rows.length; i++) {
          rutinasLite.push(data.rows.item(i));
        }

        for (var i in rutinasLite) {
          console.log("dentro del for rutinasLite:" + JSON.stringify(rutinasLite));

          this.getRutinaOfflineByRutina(rutinasLite[i].id_rutina_sqllite).then(response => {

            response.forEach(rutina => {
              rutina.fotos_por_actividad = this.authservice.AuthToken.variables.fotos_por_actividad_rutina__c;
              var subDir = rutina.id_rutina_sqllite.toString() + '/';
              uploadRutinasImages(this.file, this.origen, subDir, rutina, this.rutinasProv, this.transfer, this.database, this.authservice.AuthToken);
            });
          });
        }
        console.log("fuera del for rutinasLite:" + JSON.stringify(rutinasLite));
        return rutinasLite;
      })
  }


  syncOportunidades() {
    this.postOportunidades(this.upload)
  }

  upload(file, origen, subDir, oportunidad, ticketProv, transfer, database) {


    file.listDir(origen, subDir).then(data => {

      var images = [];
      for (let i = 0; i < data.length; i++) {
        images.push(data[i].nativeURL);
      }

      ticketProv.createTicket(oportunidad).then(id => {
        console.log("cree el ticket con id: " + id);


        database.executeSql(
          `DELETE FROM oportunidades WHERE id_case_sqllite = '${oportunidad.id_case_sqllite}';`, {

          });
        console.log("BORRE case: " + oportunidad.id_case_sqllite);

        if (images.length > 0) {

          let options: FileUploadOptions = {
            fileKey: 'azureupload',
            // fileName: fileName,
            chunkedMode: false,
            mimeType: "image/jpeg",
            // mimeType: 'multipart/form-data',
            // headers: {},
            params: { 'containername': "oportunidad" + id.toString() }
          }

          const fileTransfer: FileTransferObject = transfer.create();

          images.forEach(image => {

            options.fileName = image.substring(image.lastIndexOf('/') + 1, image.length);
            fileTransfer.upload(image, URL_SERVICIOS + '/azurecrearcontenedorsubirimagen', options)
              .then((data) => {

              }, (err) => {
                console.log('Error:' + JSON.stringify(err));
              });
          })
        }



      }, error => {

      });
    }, error => {
      console.log("falla file.listDir: " + JSON.stringify(error));

    }).then(response => {

    }).then(response => {

    });
  }

  postOportunidades(upload) {
    this.origen = this.file.dataDirectory + 'tickets/';

    this.getOportunidades().then(response => {

      response.forEach(oportunidad => {


        var subDir = oportunidad.id_case_sqllite.toString() + '/';


        upload(this.file, this.origen, subDir, oportunidad, this.ticketProv, this.transfer, this.database)
      })


    }).then(() => {

    });
  }

  uploadImages(images, id) {
    let options: FileUploadOptions = {
      fileKey: 'azureupload',
      // fileName: fileName,
      chunkedMode: false,
      mimeType: "image/jpeg",
      // mimeType: 'multipart/form-data',
      // headers: {},
      params: { 'containername': "oportunidad" + id.toString() }
    }

    const fileTransfer: FileTransferObject = this.transfer.create();

    // for (let i = 0; i < images.length; i++) {
    images.forEach(image => {

      // console.log(images[i]);
      options.fileName = image.substring(image.lastIndexOf('/') + 1, image.length);
      fileTransfer.upload(image, URL_SERVICIOS + '/azurecrearcontenedorsubirimagen', options)
        .then((data) => {
          // console.log(data+" Uploaded Successfully");

        }, (err) => {
          console.log('Error:' + JSON.stringify(err));
        });
    })
  }
}
