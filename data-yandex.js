var global_data;
var flag = 0;

var map;
var latestInfoWindow;
var placemarks;
parse_data = function (filename, callback) {
  $.get(filename, function (xml) {
    var departments = new Array();
    $(xml)
      .find("department")
      .each(function () {
        var id = $(this).find("id").text();
        var title = $(this).find("title").text();
        var room = $(this).find("room").text();
        var url = $(this).find("url").text();
        var img = $(this).find("img").text();
        var phone = $(this).find("phone").text();
        var building_id = $(this).find("building_id").text();
        departments[id] = {
          id: id,
          title: title,
          room: room,
          url: url,
          img: img,
          phone: phone,
          building_id: building_id,
        };
      });
    var buildings = new Array();
    var building_ids = new Array();
    $(xml)
      .find("building")
      .each(function () {
        var id = $(this).find("id").text();
        var title = $(this).find("title").text();
        var address = $(this).find("address").text();
        var img = $(this).find("img").text();
        var url = $(this).find("url").text();
        var lat = $(this).find("lat").text();
        var lng = $(this).find("lng").text();
        building_ids.push(id);
        buildings[id] = {
          title: title,
          address: address,
          img: img,
          url: url,
          lat: lat,
          lng: lng,
        };
      });
    var faculties = new Array();
    $(xml)
      .find("faculty")
      .each(function () {
        var id = $(this).find("id").text();
        var title = $(this).find("title").text();
        var short_title = $(this).find("short_title").text();
        var room = $(this).find("room").text();
        var url = $(this).find("url").text();
        var img = $(this).find("img").text();
        var phone = $(this).find("phone").text();
        var building_id = $(this).find("building_id").text();
        faculties[id] = {
          title: title,
          short_title: short_title,
          room: room,
          url: url,
          img: img,
          phone: phone,
          building_id: building_id,
        };
      });
    departments.sort(sortFunction);
    global_data = {
      departments: departments,
      buildings: buildings,
      building_ids: building_ids,
      faculties: faculties,
    };
    //show_map_data();
    callback && callback();
  }).fail(function () {
    alert("Ошибка при чтении файла данных. Попробуйте обновить страницу.");
  });
};
function sortFunction(a, b) {
  if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
  else return 1;
  return 0;
}

function show_map_data() {
  //show_buildings();
  var id = get_param("show_faculty");
  if (id != "") {
    show_faculty(id);
    return;
  }
  id = get_param("show_department");
  if (id != "") {
    show_department(id);
    return;
  }
  id = get_param("show_building");
  if (id != "") {
    placemarks[id].events.trigger("click");
  }
}

function initialize() {
  parse_data("/online/maps/data.xml", function () {
    ymaps.ready(init);
  });
}

function init() {
  // Создание карты.
  myMap = new ymaps.Map(
    "map",
    {
      // Координаты центра карты.
      // Порядок по умолчанию: «широта, долгота».
      // Чтобы не определять координаты центра карты вручную,
      // воспользуйтесь инструментом Определение координат.
      center: [53.91821, 27.591381],
      // Уровень масштабирования. Допустимые значения:
      // от 0 (весь мир) до 19.
      zoom: 14,
    },
    {
      // balloonMaxWidth: 200,
      // searchControlProvider: 'yandex#search'
    }
  );

  myMap.events.add("click", function (e) {
    if (myMap.balloon.isOpen()) {
      console.log("map.close");
      myMap.balloon.close();
    }
  });

  var data = global_data.buildings;
  placemarks = new Array();
  for (var i = 0; i < global_data.building_ids.length; i++) {
    var id = global_data.building_ids[i];
    var buildingData = data[id];
    placemarks[id] = addBuildingPlacemark(id, buildingData, myMap);
  }
  //show_map_data();
}

function addBuildingPlacemark(id, buildingData, myMap) {
  var position = [buildingData.lat, buildingData.lng];
  var myPlacemark = new ymaps.Placemark(
    position /*, {balloonContent: 'balloon'}*/
  );
  myPlacemark.events.add("click", function (e) {
    console.log("myPlacemark.click " + id);
    if (myMap.balloon.isOpen()) {
      console.log("myPlacemark.close " + id);
      myMap.balloon.close();
    }

    console.log("myPlacemark.open " + id);
    //var coords = e.get('coords');
    showInfoWindows(myMap, position, getBuildingsContent(id));
  });
  myMap.geoObjects.add(myPlacemark);
  return myPlacemark;
}

function showInfoWindows(myMap, coords, content) {
  console.log("showInfoWindow " + coords);
  if (myMap.balloon.isOpen()) {
    console.log("showInfoWindows.close " + coords);
    myMap.balloon.close();
  }

  console.log("showInfoWindows.open " + coords);
  myMap.balloon.open(coords, {
    contentBody: content,
    contentFooter: "<sup>Щелкните еще раз</sup>",
  });
}

function getBuildingsContent(number) {
  var building_id = number;
  var building_data = global_data.buildings[building_id];
  var faculties_data = global_data.faculties;
  var departments_data = global_data.departments;

  var content =
    '<div class="info_window"><div class="building_title">' +
    building_data.title +
    "</div><br />";
  if (building_data.url.length > 0) {
    content +=
      '<div class="medium_img_wrapper"><a href="' +
      building_data.url +
      '"><img src="' +
      building_data.img +
      '" height="100" width="149" hspace="5" alt="фото корпуса" title="Виртуальная экскурсия"/></a></div>';
  } else {
    content +=
      '<div class="medium_img_wrapper"><img src="' +
      building_data.img +
      '" height="100" width="149" hspace="5" alt="фото корпуса"/></div>';
  }
  content += '<div class="col">';
  content += "<b>Адрес</b>: " + building_data.address + "<br />";
  if (building_data.url.length > 0) {
    content +=
      '<a href="' +
      building_data.url +
      '">Виртуальная экскурсия</a><br /><br />';
  }
  var count_f = 0;
  for (var i = 0; i < faculties_data.length; i++) {
    if (faculties_data[i]) {
      if (faculties_data[i].building_id == building_id) {
        count_f = count_f + 1;
      }
    }
  }
  if (count_f > 0) {
    content += "<b>Деканаты</b>:<br />";
  }
  for (var i = 0; i < faculties_data.length; i++) {
    if (faculties_data[i]) {
      if (faculties_data[i].building_id == building_id) {
        content +=
          '<a href="' +
          faculties_data[i].url +
          '" target="_blank">' +
          faculties_data[i].short_title +
          "</a> ауд. " +
          faculties_data[i].room +
          "<br/>";
      }
    }
  }
  content += '</div><div style="clear:both"></div>';
  var dep_content = "";
  if (departments_data.length > 0) {
    for (var i = 0; i < departments_data.length; i++) {
      if (departments_data[i]) {
        if (departments_data[i].building_id == building_id) {
          if (dep_content == "") {
            dep_content =
              '<div class="departments_content"><br /><b>Кафедры</b>:<br />';
          }
          dep_content +=
            '<a href="' +
            departments_data[i].url +
            '" target="_blank">' +
            departments_data[i].title +
            "</a> ауд. " +
            departments_data[i].room +
            "<br/>";
        }
      }
    }
    dep_content += "</div>";
  }
  content += dep_content + "</div>";
  return content;
}

//centers map on specified marker
function show_department(number) {
  var data = null;
  for (var i = 0; i < global_data.departments.length; i++) {
    if (global_data.departments[i]) {
      if (global_data.departments[i].id == number) {
        data = global_data.departments[i];
      }
    }
  }
  var building_id = data.building_id;
  var building_data = global_data.buildings[building_id];
  var location = [building_data.lat, building_data.lng];

  var img_url = data.img == "" ? "/online/maps/logo.png" : data.img;
  var content =
    '<div class="info_window"><div class="building_title">' +
    building_data.title +
    "</div><br />";
  content +=
    '<div class="small_img_wrapper"><img src="' +
    img_url +
    '" width="100px" class="department_icon" alt="лого кафедры"/></div>';
  content +=
    '<div class="col2"><b><a href=\'' +
    data.url +
    "' target='_blank'>" +
    data.title +
    "</a></b><br/><br/>";
  content += "<b>Адрес</b>: " + building_data.address + "<br />";
  content += "<b>Ауд.</b> " + data.room + "<br/>";
  content += "<b>Телефон</b>: " + data.phone + "<br/>";
  content += "</div></div>";

  showInfoWindows(myMap, location, content);
  $("html, body").animate({ scrollTop: 250 }, 600);
}

//Faculties
function show_faculty(number) {
  var data = global_data.faculties[number];
  var building_id = data.building_id;
  var building_data = global_data.buildings[building_id];
  var location = [building_data.lat, building_data.lng];

  //html
  var content =
    '<div class="info_window"><div class="building_title">' +
    building_data.title +
    "</div><br />";
  content +=
    '<div class="small_img_wrapper"><img src="' +
    data.img +
    '" width="100px" class="department_icon" alt="лого факультета"/></div>';
  content +=
    '<div class="col2"><b><a href=\'' +
    data.url +
    "' target='_blank'>" +
    data.title +
    "</a></b><br/><br/>";
  content += "<b>Адрес</b>: " + building_data.address + "<br />";
  content += "<b>Деканат</b>: ауд. " + data.room + "<br/>";
  content += "<b>Телефон</b>: " + data.phone + "<br/>";
  content += "</div></div>";

  showInfoWindows(myMap, location, content);

  $("html, body").animate({ scrollTop: 250 }, 600);
}

function get_param(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if (results == null) return "";
  else return results[1];
}
