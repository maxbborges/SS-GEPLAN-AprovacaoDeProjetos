let SCOPI = {
	listaUsuarios: null
	
	, atualizarDados: function(){
		MAIN.loading.show();
		let idProjeto = $('#idProjeto').val();
		let constraints = [ DatasetFactory.createConstraint("idProjeto", idProjeto, idProjeto, ConstraintType.MUST) ];
		let dataset = DatasetFactory.getDataset("scopi_consulta_projetos", null, constraints, null
			, {
			"success": function(data){
				MAIN.loading.hide();
				if(data != null && data.values != null && data.values.length > 0){
					let projeto = data.values[0];
					projeto["ID"] = projeto.id;
					
					window["Nome_do_projeto"].setValue(projeto);
				}
			}
			, "error": function(data){
				MAIN.loading.hide();
				SCOPI.avisoAtualizacaoProjeto(data);
			}
		});
	}
	
	, carregarLink: function(){
		let projectId = $('#id_projeto').val();
		let link = (projectId == "" || projectId == null)
			? "" : "https://system.scopi.com.br/#/projects/"+projectId+"/actions";
		$('#link_scopi').val(link);
		$('#link_scopi').trigger('change');
	}

	, atualizaLinkScopi: function(){
		let link = $('#link_scopi').val();
		$('#link_renderizado').prop('href', link);
	}

	, carregarListaUsuarios: function(){
		MAIN.loading.show();
		let dataset = DatasetFactory.getDataset("scopi_consulta_usuarios", null, null, null
			, {
			"success": function(data){
				MAIN.loading.hide();
				SCOPI.listaUsuarios = null;
				if(data != null && data.values != null && data.values.length > 0){
					SCOPI.listaUsuarios = {};
					for(let i = 0; i < data.values.length; i++){
						let user = data.values[i];
						SCOPI.listaUsuarios[user.id] = user;
					}
				}
			}
			, "error": function(data){
				MAIN.loading.hide();
				SCOPI.avisoCarregamentoUsuarios(data);
			}
		});
	}

	, avisoCarregamentoUsuarios: function(data){
		let msg = "Lista de usuários do Scopi não foi carregada";
		console.error("SCOPI", (data == null) 
				? msg : data);
		FLUIGC.toast({
			title: 'Scopi: ',
			message: msg,
			type: 'warning'
		});
	}
	, avisoAtualizacaoProjeto: function(data){
		let msg = "Não foi possível atualizar dados do projeto"
		console.error("SCOPI", (data == null) 
				? msg : data);
		FLUIGC.toast({
			title: 'Scopi: ',
			message: msg,
			type: 'warning'
		});
	}
}