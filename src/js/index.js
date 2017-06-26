var core = {
	root: $('.component-form'),
	urls: {
		packages: 'http://www.cvc.com.br/monte-sua-viagem/resultados?',
		airplane: 'http://www.cvc.com.br/passagens-aereas/resultados?',
		cars: 'http://www.cvc.com.br/carros/resultados?',
		hotels: 'http://www.cvc.com.br/hoteis/resultados?'
	},
	controllerCore: function() {
		var self = $(this);
		var datas = self.data();
		var type = datas.type;
		var params = {};
		var ages = '';
		var url = '';

		for (var field in datas) {
			if (field !== 'type') {
				var details = datas[field].split(',');

				if (details[0] == 'location') {
					params[field] = self.find('[name=' + field + ']').data('citycode');
				} else if (details[0] == 'checkbox') {
					params[field] = self.find('[name=' + field + ']').is(':checked');
				} else if (details[0] == 'room') {
					var adults = self.find('.component-rooms [name="roomAdults"]');
					var room = '';

					adults.each(function() {
						for (var j = 0; j < $(this).val(); j++) {
							room += '30,';
						}

						var ages = $(this).parents('.row').next('.component-rooms__peopleQuantity__ages').find('[name="childrenAges"]');

						ages.each(function() {
							room += $(this).val() + ',';
						});

						room += '+';
					});

					params['rooms'] = room.replace(",+", "+").replace(",+", "");
				} else if (details[0] == 'date') {
					var date = self.find('[name=' + field + ']').val().split('/');
					date = date[2] + '-' + date[1] + '-' + date[0] + 'T00:00:00-03:00';

					params[field] = date;
				} else if (details[0] == 'touppercase') {
					var nameField = field.toUpperCase();

					params[nameField] = self.find('[name=' + nameField + ']').val();
				} else {
					params[field] = self.find('[name=' + field + ']').val();
				}
			}
		}

		for (var param in params) {
			url += param + '=' + params[param] + '&';
		}

		console.log(core.urls[type] + url);

		return false;
	},
	actions: {
		submit: function() {
			core.root.submit(core.controllerCore);
		}
	}
};

var componentLocation = {
	element: $('.component-location'),
	selectItem: function(item) {
		var el = $(item);
		var description = el.text();
		var _id = el.data('id');

		el.parents('.component-location').find('input').val(description);
		el.parents('.component-location').find('input').attr('data-citycode', _id);
		el.parents('.component-location__list').html("");
	},
	serviceLocation: function(value, type) {
		return $.get('https://h1917qkv5i.execute-api.us-east-1.amazonaws.com/prd/locations?q=' + value + '&productType=' + type);
	},
	controllerLocation: function() {
		var self = $(this);
		var parent = self.parents('.component-location');
		var list = parent.find('.component-location__list');
		var type = self.data('type');

		componentLocation.serviceLocation(self.val(), type).done(function(response) {
			list.html("");

			response.locations.forEach(function(item) {
				list.append('<li class="component-location__list__item" data-id="' + item._id + '" onclick="javascript:componentLocation.selectItem(this)">' + item.description + '</li>');
			});
		});
	},
	actions: {
		watchType: function() {
			componentLocation.element.find('input').keyup(componentLocation.controllerLocation);
		}
	}
};

var componentRoom = {
	element: $('.component-rooms'),
	selectChildren: function(item) {
		var el = $(item);
		var quantityChildren = el.val();
		var childrenContainer = el.parents('.row').next('.component-rooms__peopleQuantity__ages');

		if (quantityChildren == 0) {
			childrenContainer.html("");
		} else {
			childrenContainer.html("");
		}

		var template = 
			'<div class="col-sm-2">' +
				'<div class="form-group">' +
					'<label>Idade da criança: </label>' +
					'<select name="childrenAges" class="form-control">' +
						'<option value="1">1</option>' +
						'<option value="2">2</option>' +
						'<option value="3">3</option>' +
						'<option value="4">4</option>' +
						'<option value="5">5</option>' +
						'<option value="6">6</option>' +
						'<option value="7">7</option>' +
						'<option value="8">8</option>' +
						'<option value="9">9</option>' +
						'<option value="10">10</option>' +
						'<option value="11">11</option>' +
						'<option value="12">12</option>' +
						'<option value="13">13</option>' +
						'<option value="14">14</option>' +
						'<option value="15">15</option>' +
						'<option value="16">16</option>' +
						'<option value="17">17</option>' +
					'</select>' +
				'</div>' +
			'</div>';

		for (var i = 0; i < quantityChildren; i++) {
			childrenContainer.append(template);
		}
	},
	controllerRoom: function() {
		var self = $(this);
		var quantityRoom = self.val();
		var peopleContainer = self.parents('.component-rooms').find('.component-rooms__peopleQuantity');

		peopleContainer.html("");

		var template = 
		'<div class="row">' + 
			'<div class="col-sm-6">' +
				'<div class="form-group">' +
					'<label>Adultos: ' +
						'<small>+18 anos</small>' +
					'</label>' +
					'<select name="roomAdults" class="form-control">' +
						'<option value="1">1</option>' +
						'<option value="2">2</option>' +
						'<option value="3">3</option>' +
						'<option value="4">4</option>' +
						'<option value="5">5</option>' +
						'<option value="6">6</option>' +
						'<option value="7">7</option>' +
						'<option value="8">8</option>' +
						'<option value="9">9</option>' +
					'</select>' +
				'</div>' +
			'</div>' +

			'<div class="col-sm-6">' +
				'<div class="form-group">' +
					'<label>Crianças: ' +
						'<small>0 à 17 anos</small>' +
					'</label>' +
					'<select name="roomChildren" class="form-control" onchange="javascript:componentRoom.selectChildren(this)">' +
						'<option value="0">0</option>' +
						'<option value="1">1</option>' +
						'<option value="2">2</option>' +
						'<option value="3">3</option>' +
						'<option value="4">4</option>' +
						'<option value="5">5</option>' +
						'<option value="6">6</option>' +
						'<option value="7">7</option>' +
						'<option value="8">8</option>' +
						'<option value="9">9</option>' +
					'</select>' +
				'</div>' +
			'</div>' +
		'</div>' + 
		'<div class="component-rooms__peopleQuantity__ages row">' +
		'</div>'
		;

		for (var i = 0; i < quantityRoom; i++) {
			peopleContainer.append(template);
		}
	},
	actions: {
		watchRooms: function() {
			componentRoom.element.find('select[name="rooms"]').change(componentRoom.controllerRoom);
		}
	}
 };

 var componentOneTrip = {
 	element: $('.component-oneTrip'),
 	controllerOneTrip: function() {
 		var self = $(this);
 		var type = self.data('cot-type');
 		var dataFromEl = self.data('cot-target');
 		var target = self.parents(core.root).find(dataFromEl);

 		if (type === true) {
 			if (self.is(':checked')) {
	 			target.fadeIn();
	 		} else {
	 			target.fadeOut();
	 		}
 		} else {
 			if (self.is(':checked')) {
	 			target.fadeOut();
	 		} else {
	 			target.fadeIn();
	 		}
 		} 		
  	},
  	actions: {
  		change: function() {
  			componentOneTrip.element.change(componentOneTrip.controllerOneTrip);
  		}
  	}
 };

$(document).ready(function() {
	componentLocation.actions.watchType();

	componentRoom.actions.watchRooms();

	componentOneTrip.actions.change();

	core.actions.submit();

	$(".datepicker").datepicker({
		minDate: new Date(),
		dateFormat: 'dd/mm/yy'
	});
});