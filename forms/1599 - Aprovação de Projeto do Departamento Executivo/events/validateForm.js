function validateForm(form) {
	var msgError = "";
	var lineBreaker = "<br/>";

	var CURRENT_STATE = getValue('WKNumState');
	var NEXT_STATE = getValue("WKNextState");
	var COMPLETED_TASK = (getValue("WKCompletTask")=="true");
    
	log.info("Aprovação_de_projeto_do_Departamento_Executivo - validateForm - "
			+ " complete? " + COMPLETED_TASK + " - CUR = NEX? " + (CURRENT_STATE == NEXT_STATE)
			+ " - CUR: " + CURRENT_STATE);
	
	if(!COMPLETED_TASK || CURRENT_STATE == NEXT_STATE) return;
    
    if(CURRENT_STATE == Activity.ZERO || CURRENT_STATE == Activity.INICIO){
		if (campoVazio(form, "id_projeto")) {
			msgError += "ID projeto \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
		if (campoVazio(form, "Nome_do_projeto")) {
			msgError += "Nome do projeto \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
		if (campoVazio(form, "publico_alvo")) {
			msgError += "Público-alvo \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
		if (campoVazio(form, "Sumario_executi")) {
			msgError += "Sumário executivo \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
		if (campoVazio(form, "cd_resp_pelo_proj")) {
			msgError += "Responsável pelo projeto \u00E9 obrigat\u00F3ria." + lineBreaker;
		}
		if (campoVazio(form, "Selecao_OE")) {
			msgError += "Objetivo estratégico \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
		
		if (campoVazio(form, "link_scopi")) {
			msgError += "Link Scopi \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
		if (campoVazio(form, "data_inicio")) {
			msgError += "Data de início previsto \u00E9 obrigat\u00F3ria." + lineBreaker;
		}
		if (campoVazio(form, "data_fim")) {
			msgError += "Data de fim previsto \u00E9 obrigat\u00F3ria." + lineBreaker;
		}
		
		var idx = form.getChildrenIndexes("tabledetailname1");
	    if (idx.length > 0) {
	        for (var i = 0; i < idx.length; i++) {
	        	var linha = i + 1;
	        	
	        	if(campoVazio(form, 'column1_1___' + idx[i])) {
	            	//msgError+= 'Campo "ANO" é obrigat\u00F3rio (linha ' + linha + ")" + lineBreaker;
				}
	            if(campoVazio(form, 'column2_1___' + idx[i]) && campoVazio(form, 'column3_1___' + idx[i])) {
	            	//msgError+= 'Obrigat\u00F3rio informar valor para SEST ou SENAT (linha ' + linha + ")" + lineBreaker;
				}
			}
		}
	    else{
	    	//msgError+= 'Obrigat\u00F3rio adicionar pelo menos 1 registro de valor para entidade.' + lineBreaker;
	    }
	}
    else if(CURRENT_STATE == Activity.ANALISE_RESPONSAVEL_PROJETO){
    	if (campoVazio(form, "Aprova_GP")) {
			msgError += "Campo Aprovado pelo Responsável pelo projeto? \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
    	else if (form.getValue("Aprova_GP") == "Necessário ajustar" && campoVazio(form, "Ajustes_RP")) {
			msgError += "Campo Ajustes necessários sugeridos pelo Responsável pelo projeto \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
    }
    else if(CURRENT_STATE == Activity.ANALISE_RESPONSAVEL_OBJETIVO_ESTRATEGICO){
    	if (campoVazio(form, "Aprova_R_OE")) {
			msgError += "Campo Aprovado pelo Responsável pelo Objetivo Estratégico? \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
    	else if (form.getValue("Aprova_R_OE") == "Necessário ajustar" && campoVazio(form, "Ajustes_R_OE")) {
			msgError += "Campo Ajustes necessários sugeridos pelo Responsável pelo Objetivo Estratégico \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
    }
    else if(CURRENT_STATE == Activity.ANALISE_PLANEJAMENTO_ESTRATEGICO){
    	if (campoVazio(form, "Valida_PE")) {
			msgError += "Campo Validado pelo Planejamento Estratégico? \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
    	else if (form.getValue("Valida_PE") == "Necessário ajustar" && campoVazio(form, "Ajustes_P_E")) {
			msgError += "Campo Ajustes necessários sugeridos pelo Responsável pelo Planejamento Estratégico \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
    }
    else if(CURRENT_STATE == Activity.ANALISE_DIRETOR_ADJUNTO){
    	if (campoVazio(form, "Aprova_D_Adjunt")) {
			msgError += "Campo Aprovado pelo Diretor(a) Adjunto(a)? \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
    	else if (form.getValue("Aprova_D_Adjunt") == "Necessário ajustar" && campoVazio(form, "Ajustes_D_Adju")) {
			msgError += "Campo Ajustes necessários sugeridos pelo Diretor Adjunto \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
    }
    else if(CURRENT_STATE == Activity.ANALISE_DIRETORA_EXECUTIVA){
    	if (campoVazio(form, "Aprova_D_Execut")) {
			msgError += "Campo Aprovado pela Diretora Executiva? \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
    	else if (form.getValue("Aprova_D_Execut") == "Necessário ajustar" && campoVazio(form, "Ajustes_D_Execu")) {
			msgError += "Campo Ajustes necessários sugeridos pela Diretora Executiva \u00E9 obrigat\u00F3rio." + lineBreaker;
		}
    }
    
    if(msgError != ""){
        throw msgError;
    }
}

/**
 * Função campoVazio é um facilitador que evita você precisar repetir a condição completa
 * verificando se o campo está undefined, null ou se está vazio
 * @param objeto form
 * @param nomeCampo
 * @returns verdadeiro ou falso
 */
function campoVazio(form, nomeCampo) {
	return ((form.getValue(nomeCampo) == null) 
			|| (form.getValue(nomeCampo) == undefined) 
			|| (form.getValue(nomeCampo).trim() == ""));
}