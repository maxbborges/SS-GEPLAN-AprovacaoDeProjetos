function displayFields(form,customHTML){
	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);
	var currentState = getValue('WKNumState');
	var numProcess = getValue('WKNumProces');
	var emEdicao = (form.getFormMode() == "ADD" || form.getFormMode() == "MOD") 
	var currentUser = fluigAPI.getUserService().getCurrent();
	var mobile = form.getMobile();
	
	customHTML.append('<script type="text/javascript" >');
	customHTML.append('	let CONTEXT = {');
	customHTML.append('		"MODE": "' + form.getFormMode()	+ '"');
	customHTML.append('		, "IS_EDITING": ' + emEdicao);
	customHTML.append('		, "CURRENT_STATE": ' + currentState );
	customHTML.append('		, "NUM_PROCESS": ' + numProcess );
	customHTML.append('		, "USER": "' + currentUser.getCode() + '"');
	customHTML.append('		, "NAME_USER": "' + currentUser.getFullName() + '"');
//	customHTML.append('		, "IS_ADMIN": ' + ehAdmin(currentUser));
	customHTML.append('		, "IS_MOBILE": ' + mobile);
	customHTML.append('		, "NEW_LINE": ' + ((mobile) ? "' \\n'" : "' <br/>'")); 
	customHTML.append('	};');
	customHTML.append('</script>');
	
	if(currentState == Activity.ANALISE_RESPONSAVEL_PROJETO
			|| form.getValue("Aprova_GP") != ""){
		
		form.setVisibleById("panel_resp_projeto", true);
		if(form.getValue("Ajustes_Conside") != ""){
			form.setVisibleById("panel_consideracoes", true);
		}
	}
	if(currentState == Activity.ANALISE_RESPONSAVEL_OBJETIVO_ESTRATEGICO
			|| form.getValue("Aprova_R_OE") != ""){
		form.setVisibleById("panel_resp_objetivo", true);
		if(form.getValue("Ajustes_Conside") != ""){
			form.setVisibleById("panel_consideracoes", true);
		}
	}
	if(currentState == Activity.ANALISE_PLANEJAMENTO_ESTRATEGICO
			|| form.getValue("Valida_PE") != ""){
		form.setVisibleById("panel_geplan", true);
		if(form.getValue("Ajustes_Conside") != ""){
			form.setVisibleById("panel_consideracoes", true);
		}
	}
	if(currentState == Activity.ANALISE_DIRETOR_ADJUNTO
			|| form.getValue("Aprova_D_Adjunt") != ""){
		form.setVisibleById("panel_dir_adjunto", true);
		if(form.getValue("Ajustes_Conside") != ""){
			form.setVisibleById("panel_consideracoes", true);
		}
	}
	if(currentState == Activity.ANALISE_DIRETORA_EXECUTIVA
			|| form.getValue("Aprova_D_Execut") != ""){
		form.setVisibleById("panel_dir_executivo", true);
		if(form.getValue("Ajustes_Conside") != ""){
			form.setVisibleById("panel_consideracoes", true);
		}
	}
}

function ehAdmin(usuario){
	return estaNoPapel("admin", usuario);
}

function estaNoPapel(papelAlvo, usuario){
	var papeis = usuario.getRoles();
	return (papeis == null || papeis.isEmpty()) 
		? false : papeis.contains(papelAlvo);
}