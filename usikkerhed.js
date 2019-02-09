var tempValue = [], tempRange = [];
var precipValue = [], precipRange = [];
var windspeedValue = [], windspeedRange = [];
var symbol = [], windDir = [];
var symbolObj = [], windObj = [];
var chart_prec, chart_temp, chart_wind;

var WEATHER_CODES = {
	    1: 61748,
	    2: 61750,
	    3: 61735,
	    45: 61753,
	    60: 61737,
		63: 61736,
	    68: 61739,
	    69: 61738,
		70: 61741,
		73: 61740,
	    80: 61743,
		81: 61782,
	    83: 61744,
		84: 61751,
	    85: 61746,
		86: 61745,
	    101: 61778,
	    102: 61779,
	    103: 61735,
	    145: 61753,
	    160: 61737,
		163: 61736,
	    168: 61739,
	    169: 61738,
		170: 61741,
	    173: 61740,
	    180: 61724,
	    181: 61725,
	    183: 61727,
		184: 61726,
	    185: 61728,
		186: 61729
};

var WIND_CODES = {
		'S': 61706,
		'SV': 61708,
		'V': 61709,
		'NV': 61705,
		'N': 61703,
		'NØ': 61704,
		'Ø': 61702,
		'SØ': 61707
}

$(document).ready(function () {
	
	Highcharts.setOptions({
			lang : {
			decimalPoint: ",",
			months: ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"],
			shortMonths: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
			weekdays: ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"],
			shortWeekdays: ["søn", "man", "tir", "ons", "tor", "fre", "lør"],
			contextButtonTitle : "Graf menu",
			printChart : "Udskriv graf"
		}
	});
	
	
	$('#container').bind('mousemove touchmove touchstart', function (e) {
	    var chart, point, event;

	    for (var i = 0; i < 3; i++) {
	        chart = chart_temp;
	        if (i == 1) chart = chart_prec;
	        if (i == 2) chart = chart_wind;
	        
	        // Find coordinates within the chart
	        event = chart.pointer.normalize(e.originalEvent);
	        // Get the hovered point
	        var points = [];
	        for (var j = 0; j < chart.series.length; j++) {
	            point = chart.series[j].searchPoint(event, true);
	            // Get the hovered point
	            if (point) points.push(point); 
	        }
	
	        if (points.length) {
	            if (chart.tooltip.shared) {
	            	for (var j = 0; j < points.length; j++) points[j].onMouseOver();
	                chart.tooltip.refresh(points);
	            } else {
	            	points[0].onMouseOver();
	                chart.tooltip.refresh(points[0]);
	            }
	            
	            chart.xAxis[0].drawCrosshair(e, points[0]);
	        }
	    }
	});
	
	$('#container').bind('mouseleave touchend', function(e) {
	    var chart, point, i, event;

	    for (i = 0; i < 3; i++) {
	    	chart = chart_temp;
	        if (i == 1) chart = chart_prec;
	        if (i == 2) chart = chart_wind;
	        
	      	event = chart.pointer.normalize(e.originalEvent);
	      	point = chart.series[0].searchPoint(event, true);

	      	point.onMouseOut();
	      	for (var j = 0; j < chart.series.length; j++) chart.series[j].onMouseOut();
	      	chart.tooltip.hide(point);
	      	chart.xAxis[0].hideCrosshair();
	    }
	});
	
	function removeSymbols() {
		for (var i = 0; i < symbolObj.length; i++) {
			symbolObj[i].destroy();
		}
		symbolObj = [];
	}
	
	function removeWinds() {
		for (var i = 0; i < windObj.length; i++) {
			windObj[i].destroy();
		}
		windObj = [];
	}
	
	function drawSymbols() {
		var wx;
					
		for (var i = 0; i < chart_temp.series[0].points.length; i++) {

			if (i % 3 === 0 && chart_temp.series[2].yData[i]) {
				
				wx = chart_temp.series[2].yData[i][1];
				
				var sObj = chart_temp.renderer
				.text(String.fromCharCode(WEATHER_CODES[wx]), chart_temp.series[0].points[i].plotX + chart_temp.plotLeft - 20, chart_temp.series[1].points[i].plotHigh + 30)
				.attr({
                    zIndex: 5
                })
                .css({
                	fontFamily: 'DMI',
                	fontSize: '40px',
                	color: '#0C2D83'
                })
                .add();
				
				symbolObj.push(sObj);
			}
		}
	}
	
	function drawWinds() {
		var dir;
		
		for (var i = 0; i < chart_wind.series[0].points.length; i++) {
			
			if (i % 3 === 0 && chart_wind.series[2].yData[i]) {
				
				dir = chart_wind.series[2].yData[i][1];

				var wObj = chart_wind.renderer
				.text(String.fromCharCode(WIND_CODES[dir]), chart_wind.series[0].points[i].plotX + chart_wind.plotLeft - 15, chart_wind.series[1].points[i].plotHigh + 10)
				.attr({
                    zIndex: 5
                })
                .css({
                	fontFamily: 'DMI',
                	fontSize: '30px',
                	color: '#0C2D83'
                })
                .add();
				
				windObj.push(wObj);
			}
		}
	}
	
	chart_temp = new Highcharts.chart('usikkerhed_temp_container', {

	    title: {
	        text: ''
	    },
	    
	    chart: {
	    	spacingTop: 50,
	    	spacingRight: 24,
	    	events: {
	            redraw: function () {
	                if ($('#epsRow').is(':visible')) {
	                	removeSymbols();
	                	drawSymbols();
	                }
	            }
	        }
	    },
	    
	    credits: {
	    	enabled: false
	    },

	    xAxis: [{
	        type: 'datetime',
	        visible: false,
	        dateTimeLabelFormats: {
	            day: ' %a %e. %b'
	        }
	    },{
	    	type: 'datetime',
	    	linkedTo: 0,
	    	tickInterval: 24 * 3600 * 1000,
	    	gridLineWidth: 1,
	    	labels: {
	    		enabled: false
	    	}
	    }],

	    yAxis: {
	        title: {
	            text: '°C'
	        },
	        minRange: 10,
	        labels: {
	        	useHTML: true,
	        	formatter: function() {
	        		return '<div style="width:20px; text-align:right">' + this.value + '</div>'
	        	}
	        }
	    },

	    tooltip: {
	    	xDateFormat : "%A d. %e. %B %Y - %H:%M",
	        crosshairs: true,
	        useHTML: true,
	        shared: true,
	        formatter: function() {
	        	var text = Highcharts.dateFormat('%H:%M - %A d. %e. %B %Y', this.x) + 
	        	 	'<br/>Temperatur: <b>' + this.points[0].y.toFixed(1).replace('.',',') + ' °C</b><br/>Interval: <b>' +
	        	 	this.points[1].point.low.toFixed(1).replace('.',',') + ' - ' + this.points[1].point.high.toFixed(1).replace('.',',') + ' °C</b><br/>';
	        	return text;
	        }
	    },

	    legend : {
			enabled : false
		},
	    
	    exporting: {
	        buttons: {
	            contextButton: {
	                y: -20,
	                enabled: false
	            }
	        }
	    },

	    series: [{
	        name: 'Temperatur',
	        data: tempValue,
	        zIndex: 1,
	        color: '#CC1F1F',
	        marker: {
	        	enabled: false
	        }
	    },{
	        name: 'Interval',
	        data: tempRange,
	        type: 'arearange',
	        lineWidth: 0,
	        states: {
	        	hover: {
	        		enabled: false
	        	}
	        },
	        linkedTo: ':previous',
	        color: '#CC1F1F',
	        fillOpacity: 0.3,
	        marker: {
	        	enabled: false
	        },
	        zIndex: 0
	    },{
	    	name: 'dummy',
	    	visible: false,
	        data: symbol,
	        type: 'columnrange',
	        linkedTo: ':previous',
	        color: '#4660A0',
	        zIndex: 1
	    }]
	});
	
	chart_prec = new Highcharts.chart('usikkerhed_precip_container', {

	    title: {
	        text: ''
	    },
	    
	    chart: {
	    	spacingTop: 20,
	    	spacingRight: 24
	    },
	    
	    credits: {
	    	enabled: false
	    },

	    xAxis: [{
	        type: 'datetime',
	        visible: false,
	        dateTimeLabelFormats: {
	            day: ' %a %e. %b'
	        }
	    },{
	    	type: 'datetime',
	    	linkedTo: 0,
	    	tickInterval: 24 * 3600 * 1000,
	    	gridLineWidth: 1,
	    	labels: {
	    		enabled: false
	    	}
	    }],

	    yAxis: {
	        title: {
	            text: ' mm'
	        },
	        min: 0,
	        minRange: 4,
	        labels: {
	        	useHTML: true,
	        	formatter: function() {
	        		return '<div style="width:20px; text-align:right">' + this.value.toString().replace('.',',') + '</div>'
	        	}
	        }
	    },

	    tooltip: {
	    	xDateFormat : "%A d. %e. %B %Y - %H:%M",
	        crosshairs: true,
	        useHTML: true,
	        shared: true,
	        formatter: function() {
	        	var text = 'Nedbør: <b>' + this.points[0].point.low.toFixed(1).replace('.',',') + ' mm</b><br/>Interval: <b>' +
	        	 	this.points[1].point.low.toFixed(1).replace('.',',') + ' - ' + this.points[1].point.high.toFixed(1).replace('.',',') + ' mm</b><br/>';
	        	return text;
	        }
	    },

	    legend : {
			enabled : false
		},
	    
	    exporting: {
	        buttons: {
	            contextButton: {
	                y: -20,
	                enabled: false
	            }
	        }
	    },

	    plotOptions: {
	    	columnrange: {
	    		grouping: false
	    	}
	    },
	    
	    series: [{
	    	name: 'Nedbør',
	        data: precipValue,
	        type: 'columnrange',
	        color: '#4660A0',
	        zIndex: 1
	    },{
	        name: 'Interval',
	        data: precipRange,
	        type: 'columnrange',
	        linkedTo: ':previous',
	        color: '#97A5C9'
	    }]
	});

	chart_wind = new Highcharts.chart('usikkerhed_wind_container', {
		title: {
	        text: ''
	    },
	    
	    chart: {
	    	spacingTop: 20,
	    	spacingRight: 24,
	    	spacingBottom: 24,
	    	events: {
	            redraw: function () {
	                if ($('#epsRow').is(':visible')) {
	                	removeWinds();
	                	drawWinds();
	                }
	            }
	        }
	    },
	    
	    credits: {
	    	enabled: false
	    },

	    xAxis: [{
	        type: 'datetime',
	        labels: {
	            format: '{value:%H:%M}'
	        }
	    },{
	    	type: 'datetime',
	    	linkedTo: 0,
	    	tickInterval: 24 * 3600 * 1000,
	    	gridLineWidth: 1,
	    	lineWidth: 0,
	    	tickWidth: 0,
	    	dateTimeLabelFormats: {
	            day: '%a %e. %b'
	        }
	    }],

	    yAxis: {
	        title: {
	            text: 'm/s'
	        },
	        min: 0,
	        minRange: 9,
	        tickInterval: 5,
	        labels: {
	        	useHTML: true,
	        	formatter: function() {
	        		return '<div style="width:20px; text-align:right">' + this.value.toString().replace('.',',') + '</div>'
	        	}
	        }
	    },

	    tooltip: {
	    	xDateFormat : "%A d. %e. %B %Y - %H:%M",
	        crosshairs: true,
	        useHTML: true,
	        shared: true,
	        formatter: function() {
	        	var text = 'Vindstyrke: <b>' + this.points[0].y.toFixed(0) + ' m/s</b><br/>Interval: <b>' +
	        	 	this.points[1].point.low.toFixed(1).replace('.',',') + ' - ' + this.points[1].point.high.toFixed(1).replace('.',',') + ' m/s</b><br/>';
	        	return text;
	        }
	    },

	    legend : {
			enabled : false
		},
	    
	    exporting: {
	        buttons: {
	            contextButton: {
	                y: -20,
	                enabled: false
	            }
	        }
	    },

	    series: [{
	        name: 'Vindstyrke',
	        data: windspeedValue,
	        zIndex: 1,
	        color: '#008FE9',
	        marker: {
	        	enabled: false
	        }
	    }, {
	        name: 'Interval',
	        data: windspeedRange,
	        type: 'arearange',
	        lineWidth: 0,
	        linkedTo: ':previous',
	        states: {
	        	hover: {
	        		enabled: false
	        	}
	        },
	        color: '#92D0F5',
	        fillOpacity: 0.3,
	        marker: {
	        	enabled: false
	        },
	        zIndex: 0
	    },{
	    	name: 'dummy',
	    	visible: false,
	        data: windDir,
	        type: 'columnrange',
	        linkedTo: ':previous',
	        color: '#4660A0',
	        zIndex: 1
	    }]
	});
	
	if (sessionStorage.gid > 100) {
		$.ajax({
			url : "https://cors-anywhere.herokuapp.com/https://www.dmi.dk/NinJo2DmiDk/ninjo2dmidk?cmd=llj&id=" + sessionStorage.gid,
			dataType : 'json',
			success : function(data) {
				
				var precipMax = 5;
				for (i = 0; i < data.timeserie.length; i++) {
					if (data.timeserie[i].prec90 > precipMax) precipMax = data.timeserie[i].prec90;
				}
				if (precipMax > 10) precipMax = 20;
				if (precipMax > 5) precipMax = 10;
				
				for (i = 0; i < data.timeserie.length; i++) {
					if (data.timeserie[i].temp50) {
						var yyyy = data.timeserie[i].time.substring(0, 4);
						var mm = data.timeserie[i].time.substring(4, 6);
						mm -= 1;
						var dd = data.timeserie[i].time.substring(6, 8);
						var hh = data.timeserie[i].time.substring(8, 10);
						
						tempValue.push([
								Date.UTC(yyyy, mm, dd, hh, 0, 0, 0),
								data.timeserie[i].temp50]);
						tempRange.push([
								Date.UTC(yyyy, mm, dd, hh, 0, 0, 0),
								data.timeserie[i].temp10,
								data.timeserie[i].temp90]);
						precipValue.push([
								Date.UTC(yyyy, mm, dd, hh, 0, 0, 0),
								(data.timeserie[i].prec50 < 0.1)?0:data.timeserie[i].prec50,
								(data.timeserie[i].prec50 < 0.1)?0:(data.timeserie[i].prec50 + 0.05*precipMax)]);
						precipRange.push([
								Date.UTC(yyyy, mm, dd, hh, 0, 0, 0),
								(data.timeserie[i].prec10 < 0.1)?0:data.timeserie[i].prec10,
								(data.timeserie[i].prec90 < 0.1)?0:data.timeserie[i].prec90]);
						windspeedValue.push([
								Date.UTC(yyyy, mm, dd, hh, 0, 0, 0),
								data.timeserie[i].windspeed50]);
						windspeedRange.push([
								Date.UTC(yyyy, mm, dd, hh, 0, 0, 0),
								data.timeserie[i].windspeed10,
								data.timeserie[i].windspeed90]);
						symbol.push([
								Date.UTC(yyyy, mm, dd, hh, 0, 0, 0),
								data.timeserie[i].symbol]);
						
						var dir = 'N';
						if (data.timeserie[i].windDegree > 22.5) dir = 'NØ';
						if (data.timeserie[i].windDegree > 67.5) dir = 'Ø';
						if (data.timeserie[i].windDegree > 112.5) dir = 'SØ';
						if (data.timeserie[i].windDegree > 157.5) dir = 'S';
						if (data.timeserie[i].windDegree > 202.5) dir = 'SV';
						if (data.timeserie[i].windDegree > 247.5) dir = 'V';
						if (data.timeserie[i].windDegree > 292.5) dir = 'NV';
						if (data.timeserie[i].windDegree > 337.5) dir = 'N';
						windDir.push([
								Date.UTC(yyyy, mm, dd, hh, 0, 0, 0),
								dir]);
					}
				}
				
				chart_temp.series[0].setData(tempValue, true);
				chart_temp.series[1].setData(tempRange, true);
				chart_temp.series[2].setData(symbol, true);
				chart_prec.series[0].setData(precipValue, true);
				chart_prec.series[1].setData(precipRange, true);
				chart_wind.series[0].setData(windspeedValue, true);
				chart_wind.series[1].setData(windspeedRange, true);
				chart_wind.series[2].setData(windDir, true);
							
				if (data.timeserie.length > 12 && (data.timeserie[8].temp50 != null ||
						data.timeserie[9].temp50 != null || data.timeserie[10].temp50 != null)) {
					
					$('#epsRow').show();
					chart_temp.reflow();
					chart_prec.reflow();
					chart_wind.reflow();
				}
			}
		});
	}
});
