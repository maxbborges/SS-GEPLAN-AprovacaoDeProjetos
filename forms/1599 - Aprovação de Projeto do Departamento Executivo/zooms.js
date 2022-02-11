let ZOOMS = {
	interval: {},
	callbacks: {}

	, isReady(zoomId){
		return window[zoomId] != undefined && window[zoomId] != null && window[zoomId].open != null;
	}
	, executeQuandoPronto: function(zoomId, callback){
		if(ZOOMS.callbacks[zoomId] == null) ZOOMS.callbacks[zoomId] = [];
		
		ZOOMS.callbacks[zoomId].push(callback);
		ZOOMS.interval[zoomId] = setInterval(function(){
			if(ZOOMS.interval[zoomId] > 0 && ZOOMS.isReady(zoomId)){
				while (_callback = ZOOMS.callbacks[zoomId].pop()){
					//console.log("ZOOMS.callbacks",zoomId,_callback);
					_callback();
				}
				ZOOMS.clearInterval(zoomId);
			}
		});
	}
	
	, clearInterval: function(zoomId){
		window.clearInterval(ZOOMS.interval[zoomId]);
		ZOOMS.interval[zoomId] = 0;
	}
	
	, getValue:function(zoomId, qual){
		if (CONTEXT.MODE == "VIEW" || window[zoomId].getSelectedItems == undefined){
			return $("#"+zoomId).val();
		}
		else if (qual == undefined || qual == "todos"){
			return window[zoomId].getSelectedItems();
		}
		else if (qual != undefined){
			let values = window[zoomId].getSelectedItems();
			return values != null && values.length > qual ? values[qual] : "";
		}
		return "";
	}
}

//CUSTOM
function setSelectedZoomItem(selectedItem){
	if (selectedItem.inputId == "Selecao_OE"){
		$('#cd_selecao_OE').val(selectedItem.codigoObjetivo);
		$('#matricula_gestor_OE').val(selectedItem.matriculaResponsavel);
		$('#gestor_OE').val(selectedItem.responsavel);
	}
	else if(selectedItem.inputId == "Nome_do_projeto"){
		$('#id_projeto').val(selectedItem.ID);
		$('#Sumario_executi').val(selectedItem.description);
		$('#data_inicio').val(moment(
				selectedItem.prevision_start
				, 'YYYY-MM-DD', true).format('DD/MM/YYYY'));
		$('#data_fim').val(moment(
				selectedItem.prevision_end
				, 'YYYY-MM-DD', true).format('DD/MM/YYYY'));
		$('#cd_selecao_OE').val(selectedItem.objective_id);
		$('#Selecao_OE').val(selectedItem.objective_name);
		$('#id_area_responsavel').val(selectedItem.division_id);
		$('#area_responsave').val(selectedItem.division_name);
		
		SCOPI.carregarLink();
		
		$('#id_resp_pelo_proj').val(selectedItem.coordinator_id);
		$('#resp_pelo_proj').val(selectedItem.coordinator_name);
		MAIN.carregarUsuarioFluig(selectedItem.coordinator_id);
		MAIN.carregarObjetivoEstrategico(selectedItem.objective_id);
//		coordinator_id: 33
//		coordinator_name: "Tomas Nascimento"
//		division_id: 21
//		division_name: "Gerência de Planejamento e Estratégia"
//		objective_id: 30
//		objective_name: "Fortalecer o relacionamento com público-alvo"
//		sponsor_id: null
//		sponsor_name: null
	}
}

function removedZoomItem(removedItem){
	if (removedItem.inputId == "Selecao_OE"){
		$('#cd_selecao_OE').val('');
		$('#matricula_gestor_OE').val('');
		$('#gestor_OE').val('');
	}
	else if(removedItem.inputId == "Nome_do_projeto"){
		$('#id_projeto').val("");
		$('#Sumario_executi').val("");
		$('#data_inicio').val("");
		$('#data_fim').val("");
		$('#cd_selecao_OE').val("");
		$('#Selecao_OE').val("");
		$('#cd_selecao_OE').val("");
		$('#area_responsave').val("");
		
		SCOPI.carregarLink();
		
		$('#id_resp_pelo_proj').val("");
		$('#resp_pelo_proj').val("");
	}
}