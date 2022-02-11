let MAIN = {
	loading : {}

	, init: function(){
		MAIN.loading = FLUIGC.loading(window);
		
		MAIN.bind();
		MAIN.bindDateTimeFields();
		
		MAIN.displayForm();
		
		//enableFields();
		//MAIN.gerarPDFGED();
	}
	, bind: function(){
		if(CONTEXT.MODE != "VIEW" 
			&& (CONTEXT.CURRENT_STATE == Activity.ZERO
					|| CONTEXT.CURRENT_STATE == Activity.INICIO
					|| CONTEXT.CURRENT_STATE == Activity.AJUSTES)){
			$('#addValoresEntidade').on('click', MAIN.valorEntidadeAdd);
			
			$('#link_scopi').on('change', SCOPI.atualizaLinkScopi);
		}
		
		if(CONTEXT.CURRENT_STATE == Activity.AJUSTES){
			let el = $('#atualizarDadosProjeto');
			el.removeClass("hidden");
			el.addClass("fs-cursor-pointer");
			el.on('click', SCOPI.atualizarDados);
			$("#panel_consideracoes").show();
			SCOPI.atualizaLinkScopi();
		}
		else if(CONTEXT.CURRENT_STATE == Activity.ANALISE_RESPONSAVEL_PROJETO){
			MAIN.bindValidarParecer('Aprova_GP','Ajustes_RP');
			SCOPI.atualizaLinkScopi();
		}
		else if(CONTEXT.CURRENT_STATE == Activity.ANALISE_RESPONSAVEL_OBJETIVO_ESTRATEGICO){
			MAIN.bindValidarParecer('Aprova_R_OE','Ajustes_R_OE');
			SCOPI.atualizaLinkScopi();
		}
		else if(CONTEXT.CURRENT_STATE == Activity.ANALISE_PLANEJAMENTO_ESTRATEGICO){
			MAIN.bindValidarParecer('Valida_PE','Ajustes_P_E');
			SCOPI.atualizaLinkScopi();
		}
		else if(CONTEXT.CURRENT_STATE == Activity.ANALISE_DIRETOR_ADJUNTO){
			MAIN.bindValidarParecer('Aprova_D_Adjunt','Ajustes_D_Adju');
			SCOPI.atualizaLinkScopi();
		}
		else if(CONTEXT.CURRENT_STATE == Activity.ANALISE_DIRETORA_EXECUTIVA){
			$("#div_gerar_pdf").hide();
			MAIN.bindValidarParecer('Aprova_D_Execut','Ajustes_D_Execu');
			SCOPI.atualizaLinkScopi();
		}
	}
	, bindValidarParecer: function(idAprov, idObs){
		let aprovacaoEl = $('[name="'+idAprov+'"]');
		aprovacaoEl.on('change', function(){
			let label = $('[for="'+idObs+'"]');
			if(aprovacaoEl.filter(':checked').val() != "Sim") label.addClass("required");
			else label.removeClass("required");
		});
	}
	, bindDateTimeFields: function(){
		if(CONTEXT.MODE == "VIEW" 
			|| (CONTEXT.CURRENT_STATE != Activity.ZERO
					&& CONTEXT.CURRENT_STATE != Activity.INICIO
					&& CONTEXT.CURRENT_STATE != Activity.AJUSTES))
			return false;
		
		$('#addValoresEntidade').removeClass('hidden');
	},
	
	imprimirCustom: function(){
		$("#panel_consideracoes").hide();
		$(".esconde_impressao").hide();
		
		printWebDeskFrame();
		
		$("#panel_consideracoes").show();
		$(".esconde_impressao").show();
		
	}
	
	, displayForm: function(){
		if(CONTEXT.MODE != "VIEW"){
			if(CONTEXT.CURRENT_STATE == Activity.ZERO
					|| CONTEXT.CURRENT_STATE == Activity.INICIO
					|| CONTEXT.CURRENT_STATE == Activity.AJUSTES){
				SCOPI.carregarListaUsuarios();
			}
			else{
				//Esconde coluna da lixeira
				$($('.tableHeadRow').find('th')[0]).hide();
				$('.bpm-mobile-trash-column').hide();
			}
		} 
	}
	
	, valorEntidadeAdd: function(){
		let idx = wdkAddChild('tabledetailname1');
		let $referencia = $('[name="column1_1___'+idx+'"]');
		let $linha = $referencia.parents('tr');

		let $_year = $linha.find(".year");
		$_year.on('change', function() { UTILS.validateYear($(this)); });
		
		let $_money = $linha.find(".money");
		$_money.maskMoney({ 
			thousands: '.', 
			decimal: ',', 
			precision: 2
		});
	}
	
	, carregarUsuarioFluig: function(scopiUserId){
		MAIN.loading.show();
		
		if(SCOPI.listaUsuarios != null){
			let email = SCOPI.listaUsuarios[scopiUserId].email;
			let constraints = [ DatasetFactory.createConstraint("mail", email, email, ConstraintType.MUST) ];
			let dataset = DatasetFactory.getDataset("colleague", ["colleagueId"], constraints, null
				, {
				"success": function(data){
					MAIN.loading.hide();
					if(data != null && data.values != null && data.values.length > 0){
						$('#cd_resp_pelo_proj').val(data.values[0].colleagueId);
					}
				}
				, "error": function(data){
					MAIN.loading.hide();
					SCOPI.avisoCarregamentoUsuarios(data);
				}
			});
		}
		else{
			MAIN.loading.hide();
			SCOPI.avisoCarregamentoUsuarios();
		}
	}, gerarPDF: function(){
		
		
		$("#gerar_pdf").val("s");
			parent.$('[data-save]').eq(0).trigger('click');
			parent.intervalId = setInterval(function(){
				let href = parent.$('.links li').eq(0).find('a').attr('href');
				if(parent.intervalId > 0 && href != null && href != ""){
			
					window.clearInterval(parent.intervalId);
					parent.intervalId = 0;
					parent.window.location = href;
					
					

					 
					
					
				}
			}, 1500);

		
		
	}
	
	, testePDF: function(){
		if($("#nr_doc_form").val() != ""){
			FLUIGC.toast({
				message: 'Formulário do Processo já gerado, favor enviar a solicitação.',
				type: 'success'
			});
		}else{
			$("#panel_resp_projeto").hide();
			$("#panel_resp_objetivo").hide();
			$("#panel_geplan").hide();
			$("#panel_dir_adjunto").hide();
			$("#panel_dir_executivo").hide();
			$("#panel_consideracoes").hide();
			var pdf = new jsPDF('p', 'pt', 'a4');
			pdf.internal.scaleFactor = 2;
			$(window).scrollTop(0);
			var options = {
				     pagesplit: true,
				     'background': '#fff'
				};
			pdf.addHTML($('#form_content'), options, function() {
				var out = pdf.output('blob');
			    var reader = new FileReader();

			    reader.readAsDataURL(out); 
			    console.log("vai dar o render");
			    console.log(reader);
			    reader.onloadend = function() { // for blob to base64
			    	console.log(reader);
			         base64data = reader.result; 
			         console.log("base64 data is ");               
			         console.log(base64data );
			         base64 = base64data;
			         base64 = base64.split("data:application/pdf;base64,")[1];
			         
			         
			         var nr_solicitacao = CONTEXT.NUM_PROCESS;
			         var nm_arquivo = "solic_"+nr_solicitacao+".pdf";
			         var nr_pasta = "1483";
			         var constraintsDocument = new Array();
			         constraintsDocument.push(DatasetFactory.createConstraint("nm_arquivo", nm_arquivo, nm_arquivo, ConstraintType.MUST));
			         constraintsDocument.push(DatasetFactory.createConstraint("nr_pasta", nr_pasta, nr_pasta, ConstraintType.MUST));
						constraintsDocument.push(DatasetFactory.createConstraint("base64", base64, base64, ConstraintType.MUST));
						let dsDocument = DatasetFactory.getDataset('ds_grava_documento', null, constraintsDocument, null)

						if(dsDocument != null && dsDocument != undefined){
							if(dsDocument.values.length > 0){

								documentId = dsDocument.values[0]["documentId"];
								
								console.log(documentId);
								$("#nr_doc_form").val(documentId);
								FLUIGC.toast({
									message: 'Formulário do Processo gerado com sucesso.',
									type: 'success'
								});
								
							}
						}
						
						
						
			    }
			});
			$("#panel_resp_projeto").show();
			$("#panel_resp_objetivo").show();
			$("#panel_geplan").show();
			$("#panel_dir_adjunto").show();
			$("#panel_dir_executivo").show();
		}
		
	}
	
	, gerarPDFGED: function(){
		var gerar_pdf = $("#gerar_pdf").val();
		if(CONTEXT.CURRENT_STATE == Activity.ANALISE_DIRETORA_EXECUTIVA && gerar_pdf == "s"){
			var base64 = "";
			console.log($('#form_content')[0]);
			var pdf = new jsPDF('p', 'pt', 'letter');
			
			pdf.addHTML($('#form_content').get(0),0,0, function() {
				var out = pdf.output('blob');
			    var reader = new FileReader();

			    reader.readAsDataURL(out); 
			    console.log("vai dar o render");
			    console.log(reader);
			    reader.onloadend = function() { // for blob to base64
			    	console.log(reader);
			         base64data = reader.result; 
			         console.log("base64 data is ");               
			         console.log(base64data );
			         base64 = base64data;
			         base64 = base64.split("data:application/pdf;base64,")[1];
			         
			         
			         var constraintsDocument = new Array();
						constraintsDocument.push(DatasetFactory.createConstraint("base64", base64, base64, ConstraintType.MUST));
						let dsDocument = DatasetFactory.getDataset('ds_grava_documento', null, constraintsDocument, null)

						if(dsDocument != null && dsDocument != undefined){
							if(dsDocument.values.length > 0){

								documentId = dsDocument.values[0]["documentId"];
								
								console.log(documentId);
								
							}
						}
						
						
						
			    }
			});
		}
		
	}
	
	, habilitarGeracaoPDF: function(){
		$("#div_gerar_pdf").show();
	}
	
	, desabilitarGeracaoPDF: function(){
		$("#div_gerar_pdf").hide();
	}
	
	, carregarObjetivoEstrategico: function(objective_id){
		
		let constraints = [ DatasetFactory.createConstraint("codigoObjetivo", objective_id, objective_id, ConstraintType.MUST) ];
		let dataset = DatasetFactory.getDataset("sest_objetivos_estrategicos", null, constraints, null
			, {
			"success": function(data){
				MAIN.loading.hide();
				if(data != null && data.values != null && data.values.length > 0){
					$('#cd_selecao_OE').val(data.values[0].codigoObjetivo);
					$('#matricula_gestor_OE').val(data.values[0].matriculaResponsavel);
					$('#gestor_OE').val(data.values[0].responsavel);
				}else{
					FLUIGC.toast({
						message: 'Erro ao carregar o Objetivo Estratégico, favor validar o cadastro.',
						type: 'danger'
					});
				}
			}
			, "error": function(data){
			}
		});
	
		
	}
}

$(document).ready(function() {
	MAIN.init();
});

var beforeSendValidate = function (numState,nextState){
	
	if(numState == Activity.ANALISE_DIRETORA_EXECUTIVA && nextState == 66){
		if($("input:radio[name='Aprova_D_Execut']:checked").val() == "Sim"){
			
			if($("#nr_doc_form").val() == ""){
				throw "Favor gerar o arquivo PDF do Formulário";
			}
			
		}
	}
	
}

