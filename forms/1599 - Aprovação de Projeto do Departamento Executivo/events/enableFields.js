function enableFields(form) {
	var emEdicao = (form.getFormMode() == "ADD" || form.getFormMode() == "MOD") 
    var currentState = getValue("WKNumState"); 
    
	if(currentState != Activity.ZERO
			&& currentState != Activity.INICIO
			&& currentState != Activity.AJUSTES){
		form.setEnabled("Nome_do_projeto", false);
	    form.setEnabled("publico_alvo", false);
	    form.setEnabled("Selecao_OE", false);
	    
	    var indice = form.getChildrenIndexes("tabledetailname1");               
        for (var i = 0; i < indice.length; i++) {
            //Indice naquela posição da lista
        	var idx = indice[i];
            form.setEnabled("column1_1___"+idx, false);
            form.setEnabled("column2_1___"+idx, false);
            form.setEnabled("column3_1___"+idx, false);
        }
	}
	
	if(currentState != Activity.ANALISE_RESPONSAVEL_PROJETO){
		form.setEnabled("Aprova_GP", false);
	    form.setEnabled("Ajustes_RP", false);
	}
	if(currentState != Activity.ANALISE_RESPONSAVEL_OBJETIVO_ESTRATEGICO){
		form.setEnabled("Aprova_R_OE", false);
	    form.setEnabled("Ajustes_R_OE", false);
	}
	if(currentState != Activity.ANALISE_PLANEJAMENTO_ESTRATEGICO){
		form.setEnabled("Valida_PE", false);
	    form.setEnabled("Ajustes_P_E", false);
	}
	if(currentState != Activity.ANALISE_DIRETOR_ADJUNTO){
		form.setEnabled("Aprova_D_Adjunt", false);
	    form.setEnabled("Ajustes_D_Adju", false);
	}
	if(currentState != Activity.ANALISE_DIRETORA_EXECUTIVA){
		form.setEnabled("Aprova_D_Execut", false);
	    form.setEnabled("Ajustes_D_Execu", false);
	}
	if(currentState != Activity.AJUSTES){
		form.setEnabled("Ajustes_Conside",false);
	}
}