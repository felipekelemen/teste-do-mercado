// JavaScript Document

//Iniciliazações
var table;

$(document).ready(function() {
	"use strict";
	
	//Objeto linha da tabela
	function Data(code, type, name, price, qtd, negoc) {
	  this.code = code;
	  this.type = type;
	  this.name = name;
	  this.price = price;
	  this.qtd = qtd;
	  this.negoc = negoc;
	}
	
	//Referencia para o Firebase
	var opsRef = new Firebase("https://teste-do-mercado.firebaseio.com/operacoes");
	
	opsRef.once("value", function(allOps) {
		var i = 0;
		var dataSet = [];
		
		//Carrega todos as operacoes ja realizadas
		allOps.forEach(function(values) {
			var code = values.child("code").val();
			var type = values.child("type").val();
			var name = values.child("name").val();
			var price = values.child("price").val();
			var qtd =  values.child("qtd").val();
			var negoc =  values.child("negoc").val();
			
			dataSet[i] = new Data(code, type, name, price, qtd ,negoc);
			i++;
		});
		
		//Cria tabela e configura
		table = $('#op-table').DataTable({
			data: dataSet,
			columns: [
				{ data: 'code' },
				{ data: 'type' },
				{ data: 'name' },
				{ data: 'price'},
				{ data: 'qtd' },
				{ data: 'negoc' }
			], 
			stateSave: true,
			select: 'single',
			"language": {
				"sEmptyTable": "Nenhum registro encontrado",
				"sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
				"sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
				"sInfoFiltered": "(Filtrados de _MAX_ registros)",
				"sInfoPostFix": "",
				"sInfoThousands": ".",
				"sLengthMenu": "_MENU_ resultados por página",
				"sLoadingRecords": "Carregando...",
				"sProcessing": "Processando...",
				"sZeroRecords": "Nenhum registro encontrado",
				"sSearch": "Pesquisar",
				"oPaginate": {
					"sNext": "Próximo",
					"sPrevious": "Anterior",
					"sFirst": "Primeiro",
					"sLast": "Último"
				},
				"oAria": {
					"sSortAscending": ": Ordenar colunas de forma ascendente",
					"sSortDescending": ": Ordenar colunas de forma descendente"
				}
			}
		} );
	});
	
	//Validações
	$('#inputCode').on('input', function() { 
		validate("inputCode");
	});
	
	$('#inputType').on('input', function() { 
		validate("inputType");
	});
	
	$('#inputName').on('input', function() { 
		validate("inputName");
	});
	
	$('#inputPrice').on('input', function() { 
		validate("inputPrice");
	});
	
	$('#inputQtd').on('input', function() { 
		validate("inputQtd");
	});
	
	//Reset
	document.getElementById("resetButton").onclick = function fun() {
           reset_all();
    };
} );

//Botão Confirmar
function confirm() {
	"use strict";
	if (!validate("inputCode") || !validate("inputType") || !validate("inputName") ||
			!validate("inputPrice") || !validate("inputQtd")) {
		return false;
	}
	$("#confirmModal").modal();
}

//Botão Confirmar Modal
function yesconfirm() {
	"use strict";
	var code = document.getElementById("inputCode").value;
	var type = document.getElementById("inputType").value;
	var name = document.getElementById("inputName").value;
	var price = document.getElementById("inputPrice").value;
	var qtd = document.getElementById("inputQtd").value;
	var negoc = document.getElementById("buysell").value;
	
	var firebaseRef = new Firebase("https://teste-do-mercado.firebaseio.com/");
	var opsRef = firebaseRef.child("operacoes");
	
	//Envia valores pro Firebase
	opsRef.push().set({
		code: code,
		type: type,
		name: name,
		price: price,
		qtd: qtd,
		negoc: negoc
	});
	
	//Colore as linhas recentemente adicionadas
	var rowNode = table.row.add({
		"code": code, 
		"type": type, 
		"name": name, 
		"price": price, 
		"qtd": qtd, 
		"negoc": negoc
	}).draw().node();
	
	if (negoc === "Compra") {
		$( rowNode )
		.css( 'color', 'red' )
		.animate( { color: 'black' } );
	} else if (negoc === "Venda") {
		$( rowNode )
		.css( 'color', 'green' )
		.animate( { color: 'black' } );
	}
}

//Reset All
function reset_all(){
	"use strict";
	reset("inputCode");
	reset("inputType");
	reset("inputName");
	reset("inputPrice");
	reset("inputQtd");
}

function reset(id) {
	"use strict";
	$("#" + id).val("");
	var divCode = $("#" + id).closest("div");
	divCode.removeClass("has-error").removeClass("has-success");
}

//Validação
function validate(id) {
		"use strict";
		var div = $("#" + id).closest("div");
		if (($("#" + id).val() === null) || ($("#" + id).val() === "")) {
				
				div.addClass("has-error");
				div.removeClass("has-sucess");
				return false;
		} else {
				div.addClass("has-success");
				div.removeClass("has-error");
				return true;
		}

}


