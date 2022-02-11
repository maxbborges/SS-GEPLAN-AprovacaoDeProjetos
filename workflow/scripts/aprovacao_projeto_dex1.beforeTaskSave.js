//Definindo os parâmetros
var horario = new Date().toLocaleTimeString('pt-BR').toString().split(':').join('');
var horario2 = new Date().toLocaleTimeString('pt-BR');

var hoje = new Date().toLocaleDateString('pt-BR');
var parentFolder;
var calendar = java.util.Calendar.getInstance().getTime();


function beforeTaskSave(colleagueId, nextSequenceId, userList) {
	
	var ativAtual = getValue("WKNumState");
	log.info("ativAtual " + ativAtual);
	if( nextSequenceId == 45){
		if(ativAtual != 34) {
			parentFolder = String(hAPI.getCardValue("parentFolder"));
		getAttach();
		}
	}
	
	//sandro
	
	/*
	if( nextSequenceId == 195){ // Aprovação parecer juridicio
		if(ativAtual != 27) {
			parentFolder = String(hAPI.getCardValue("parentFolder"));
		getAttach();
		}
	}	
	*/
	
	
}

function executeWebservice(params, callback) {
	log.info("APROVACAO DOS PROJETOS - executeWebservice - params: " +  jsonStringify(params));

	
	
    var constraints = [];

    params.forEach(function (param) {
        constraints.push(DatasetFactory.createConstraint(param.name, param.value, param.value, ConstraintType.MUST));
    });

    if (constraints.length > 0) {
        var dsAux = DatasetFactory.getDataset("ds_auxiliar_vertsign", null, constraints, null);
        log.info("SS SC ## - log.dir ds_auxiliar_vertsign >>>>>>>>>>>>>>");
        log.dir(dsAux);
        if (callback) {
        	if(dsAux == null || dsAux.rowsCount == null){
        		throw "Falha de comunicação com a VertSign. "
        		+ "O TOTVS Fluig não conseguir realizar a comunicação, tente novamente mais tarde";
        	}
            if (dsAux.rowsCount > 0) {
                if (dsAux.getValue(0, "Result") === "OK") {
                    callback();
                }
            }
        }
    }
    
}

function getAttach() {
	log.info("entrando getAttach");
	var nome = ''
	var arraySigners = [];
    var anexos = new java.util.ArrayList();
    var docs = hAPI.listAttachments();
    var solicitacao = getValue("WKNumProces");
	var c1 = DatasetFactory.createConstraint('processInstanceId', solicitacao, solicitacao, ConstraintType.MUST);
	var mapaControle = [];
    var atividades = [22,26]
    
    for (var i = 0; i < atividades.length; i++){
    	var c2 = DatasetFactory.createConstraint('choosedSequence', atividades[i], atividades[i], ConstraintType.MUST);
    	var tarefa = DatasetFactory.getDataset('processTask', ["choosedColleagueId"], [c1,c2], null);
    	if (tarefa && tarefa.rowsCount > 0) {	
			usuario = tarefa.getValue(tarefa.rowsCount-1, "choosedColleagueId");
		}
    	log.info("usuario encontrato " + usuario);
    	if(usuario == null || usuario == ""){
    		log.info("#### >> ERRO!")
    	}
    	
    	var user = getFluigUser(usuario);
    	var consUser = DatasetFactory.createConstraint('email', user.mail, user.mail, ConstraintType.MUST);
		var assinante = DatasetFactory.getDataset('ds_busca_assinante', null, [consUser], null);
		if (assinante && assinante.rowsCount > 0) {
			var mail = assinante.getValue(0, "email");
		}
		log.info("#### >> MAPA DE CONTROLE")
		if(mapaControle.indexOf(String(mail))==-1){
			mapaControle.push(String(mail))
			log.info("#### >> "+String(mail))
			JSON.stringify(mapaControle)
			
			arraySigners.push({
		        nome: new String(assinante.getValue(0, "nome")),
		        email: new String(mail),
		        cpf: new String(assinante.getValue(0, "cpf")),
		        tipo: new String(assinante.getValue(0, "tipoAssinatura")), //"E",
		        status: "Pendente"
		    });
			nome = new String(assinante.getValue(0, "nome"));
		}
    }
//    log.dir(arraySigners);
//    log.info(JSON.stringify(arraySigners));
//    return arraySigners;
//    
//    
//    
//    var cpf_diretor_adjunto = "3833312e3634312e3534312d3030";
//    var cpf_diretora_executiva = "3031392e3138392e3434312d3939";
//    
//    var arraySigners = []
//    
//    var constraint1 = DatasetFactory.createConstraint("cpf", cpf_diretor_adjunto, cpf_diretor_adjunto,ConstraintType.MUST);
//    var constraint2 = DatasetFactory.createConstraint("cpf", cpf_diretora_executiva, cpf_diretora_executiva,ConstraintType.MUST);
//    var constraints = new Array(constraint1);
//    var assinantes = DatasetFactory.getDataset("ds_vertsign_assinantes", null, constraints, null);
//	log.info("======= assinantes rowsCount: " + assinantes.rowsCount);
//	for ( var x = 0; x < assinantes.rowsCount; x++) {
//		var nome = assinantes.getValue(x, "nome");
//		var email = assinantes.getValue(x, "email");
//		var cpf = assinantes.getValue(x, "cpf");
//		var tipo = assinantes.getValue(x, "tipoAssinatura");
//		var cpf_formatado = hex2a(cpf);
//		var email_formatado = hex2a(email);
//		
//		log.info("Nome: " + nome);
//		log.info("email " + email);
//		log.info("cpf " + cpf);
//		log.info("tipo " + tipo);
//		log.info("cpf_formatado " + cpf_formatado);
//		log.info("email_formatado " + email_formatado);
//		
//		arraySigners.push({
//	        nome: nome,
//	        email: email_formatado,
//	        cpf: cpf_formatado,
//	        tipo: tipo,
//	        status: "Pendente"
//	    });
//		
//
//	}
    
    log.info("arraySigners " + arraySigners);
    log.info("jsonStringify(arraySigners)" + jsonStringify(arraySigners));
    if (docs.size() > 0) {
        for (var i = 0; i < docs.size(); i++) {
            var doc = docs.get(i);

            var idAnexo = doc.getDocumentId();
            var vrAnexo = doc.getVersion();
            var dsAnexo = doc.getDocumentDescription();

            // Cria o documento na pasta informada
            createDocument(doc, parentFolder);

            // Cria registro de formulario
            var nmArquivo = {
                name: "nmArquivo",
                value: dsAnexo
            };
            var codArquivo = {
                name: "codArquivo",
                value: idAnexo
            };
            var vrArquivo = {
                name: "vrArquivo",
                value: vrAnexo
            };
            var codPasta = {
                name: "codPasta",
                value: parentFolder
            };
            var codRemetente = {
                name: "codRemetente",
                value: getValue("WKUser")
            };
            var nmRemetente = {
	                name: "nmRemetente",
	                value: nome
	        };
            var formDescription = {
                name: "formDescription",
                value: dsAnexo
            };
            var status = {
                name: "status",
                value: "Enviando para assinatura"
            };
            var metodo = {
                name: "metodo",
                value: "create"
            };

            var dataEnvio = {
                name: "dataEnvio",
                value: hoje
            };
            var jsonSigners = {
                    name: "jsonSigners",
                    value: jsonStringify(arraySigners)
                };
            
            var horaEnvio = {
                name: "horaEnvio",
                value: horario2
            };
            
            var numSolic = {
            	name: "numSolic",
                value: getValue("WKNumProces")            		
            };
            
            var choosedState = {
            	name: "choosedState",
                value: "45"            		
            };  
            

            var constraints = [jsonSigners, nmArquivo, codArquivo, vrArquivo, codPasta, codRemetente, nmRemetente, formDescription, status, metodo, dataEnvio, horaEnvio, numSolic, choosedState];
            log.info(constraints)
            
            executeWebservice(constraints, function () {
                log.info("Enviando documento para assinatura");
            })
        }

    } else {
        //throw "É preciso anexar o documento para continuar o processo!";
    	//provisorio pois não está enviado docs para o vert sign  
    }
}

function createDocument(document, parentFolder) {

    if (document && parentFolder) {
        document.setParentDocumentId(Number(parentFolder));
        document.setVersionDescription("Processo: " + getValue("WKNumProces"));
        document.setExpires(false);
        document.setCreateDate(calendar);
        document.setInheritSecurity(true);
        document.setTopicId(1);
        document.setUserNotify(false);
        document.setValidationStartDate(calendar);
        document.setVersionOption("0");
        document.setUpdateIsoProperties(true);

        // Publica o documento
        //hAPI.publishWorkflowAttachment(document);
    }
}

function jsonStringify(obj) {
	if(obj == null) {
	    return "null";
	} else if(Object.prototype.toString.call(obj) === '[object Array]') {
	    var str = "[";
	    if(obj.length > 0) {
	      str += jsonStringify(obj[0]);
	      for(var i = 1; i < obj.length; i++) {
	        str += "," + jsonStringify(obj[i]);
	      }
	    }
	    str += "]";
	    return str;
	} else if(Object.prototype.toString.call(obj) === '[object Object]') {
	    var str = "{";
	    var first = true;
	    for(attr in obj) {
	      str += (!first ? "," : "") + "\"" + attr + "\":" + jsonStringify(obj[attr]);
	      first = false;
	    }
	    str += "}";
	    return str;
	} else {
	    return "\"" + obj + "\"";
	}
};

function getFluigUser(colleagueId){
	log.info("SolicitacaoCompras - getFluigUser - colleagueId: " + colleagueId);
	var company = getValue("WKCompany");
	var user = {"colleagueName":"","login":"","mail":""};
	
	var constraints = [];
	constraints.push(DatasetFactory.createConstraint("colleaguePK.companyId", company, company, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("colleaguePK.colleagueId", colleagueId, colleagueId, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("active", true, true, ConstraintType.MUST));
	
	var fields = [ "colleagueName", "login", "mail" ];
	var dataset = DatasetFactory.getDataset("colleague", fields, constraints, null);
	if(dataset.rowsCount > 0) {
		user.colleagueName = dataset.getValue(0,"colleagueName");
		user.login = dataset.getValue(0,"login");
		user.mail = dataset.getValue(0,"mail");
	}
	else{
		log.error("Usuario nao encontrado para a matricula: "+colleagueId);
		throw("Usuario inativo nao encontrado para a matricula: "+colleagueId);
	}
	
	return user;
}


function hex2a(r){for(var t=String(r),n="",e=0;e<t.length&&"00"!==t.substr(e,2);e+=2)n+=String.fromCharCode(parseInt(t.substr(e,2),16));return n}function a2hex(r){for(var t=[],n=0,e=(r=String(r)).length;n<e;n++){var o=Number(r.charCodeAt(n)).toString(16);t.push(o)}return t.join("")}