var markers = [
  {
    id: 1,
    center: [53.918598570652975, 27.593955000000005],
    name: "Корпус №2",
    info: "<p class='marker-title'>Зал каталогов</p>ул. П. Бровки, 4, ком. 109<p>тел. (017) 293-80-57</p>Понедельник-пятница <span>9.00-19.00</span>, суббота <span>9.00-17.00</span> Выходной: воскресенье),<p class='marker-title'>Абонемент основного фонда</p>ул. П. Бровки,4,ком.104<p>тел. (017)293-21-55</p>Понедельник-пятница <span>9.00-19.00</span>, суббота <span>9.00-17.00</span> Выходной: воскресенье,<p class='marker-title'>Читальный зал для научных сотрудников</p>ул. П. Бровки, 4, ком.106<p>тел. (017)293-21-57</p>Понедельник-пятница <span>9.00-19.00</span>, суббота <span>9.00-17.00</span> Выходной: воскресенье,<p class='marker-title'>Читальный зал периодических изданий</p>ул. П.Бровки, 4,ком. 102<p>тел. (017)293-21-58</p>Понедельник-пятница <span>9.00-19.00</span>, суббота <span>9.00-17.00</span> Выходной: воскресенье,<p class='marker-title'>Студенческий читальный зал №1</p>ул.П.Бровки,4,ком.111<p>elib@bsuir.by</p>Понедельник-пятница <span>9.00-19.00</span>,суббота <span>9.00-17.00</span> Выходной: воскресенье.",
    balloonContent:
      "Зал каталогов, Абонемент основного фонда, Читальный зал для научных сотрудников, Читальный зал периодических изданий, Студенческий читальный зал №1",
  },

  {
    id: 2,
    center: [53.916774570648265, 27.596137499999994],
    name: "Корпус №3",
    info: "<p class='marker-title'>Читальный зал электронная библиотека</p>ул. П. Бровки, 10, ком.106<p>тел. (017)293-86-54 gornostaeva@bsuir.by</p>Понедельник-пятница <span>9.00-19.00</span>, суббота <span>9.00-17.00</span> Выходной: воскресенье.",
    balloonContent: "Читальный зал электронная библиотека",
    balloonOffset: [5, -68],
  },

  {
    id: 3,
    center: [53.91209157063624, 27.594754499999947],
    name: "Корпус №4",
    info: "<p class='marker-title'>Абонемент художественной литературы</p>ул. Гикало, 9, ком.111а<p>тел. (017) 293-23-82 iu.maksimenko@bsuir.by</p>Понедельник-четверг <span>9.00-17.30</span>, пятница <span>с 8.30-16.00</span> Выходные: суббота, воскресенье,<p class='marker-title'>Абонемент учебной литературы</p>ул.Гикало,9,ком.103<p>тел. (017)293-86-52</p>Понедельник-пятница <span>9.00-19.00</span>, суббота <span>9.00-17.00</span> Выходной: воскресенье,<p class='marker-title'>Студенческий читальный зал №2</p>ул. Гикало, 9, ком.107<p>тел. (017)293-86-52</p>Понедельник-пятница <span>9.00-19.00</span>, суббота <span>9.00-17.00</span> Выходной: воскресенье.",
    balloonContent:
      "Абонемент художественной литературы, Абонемент учебной литературы, Студенческий читальный зал №2",
  },
  {
    id: 4,
    center: [53.90308457067143, 27.598158999999985],
    name: "Корпус №8",
    info: "<p class='marker-title'>Зал электронных ресурсов</p>ул. Козлова, 28, ком. 310<p>тел. (017)374-70-35</p>Понедельник-четверг <span>8.30-17.30</span>, пятница <span>8.30-16.00</span> Выходные: суббота, воскресенье.",
    balloonContent: "Зал электронных ресурсов",
  },
];

ymaps.ready(init);

function init() {
  var myMap = new ymaps.Map(
    "map",
    {
      center: [],
      zoom: 14,
      controls: [],
    },
    {
      searchControlProvider: "yandex#search",
    }
  );

  var mapMenu = $(".map-menu");

  var placemarks = [];

  var collection = new ymaps.GeoObjectCollection(null, {});

  for (var i = 0, l = markers.length; i < l; i++) {
    createMapMenu(markers[i]);
  }

  function createMapMenu(marker) {
    myMap.geoObjects.add(collection);

    var placemark = new ymaps.Placemark(
      marker.center,
      { balloonContent: marker.balloonContent },
      {
        iconLayout: "default#image",
        iconImageHref: "../img/placemark.svg",
        balloonOffset: marker.balloonOffset ? marker.balloonOffset : [5, -38],
        hideIconOnBalloonOpen: false,
      }
    );

    collection.add(placemark);

    placemarks[marker.id] = placemark;

    var menuElement = $(
      '<li class="map-menu-item" id="item-' +
        marker.id +
        '"><a href="#">' +
        marker.name +
        "</a></li>"
    );
    menuElement.appendTo(mapMenu);

    menuElement.find("a").bind("click", function (e) {
      e.preventDefault();
      resetActiveProperties();
      $(menuElement).addClass("active");
      findActiveElement();
    });

    $(menuElement).mouseenter(function () {
      findInactiveElements();
      for (var i = 0; i < inactiveElements.length; i++) {
        if (this == inactiveElements[i]) {
          placemark.options.set("iconImageHref", "../img/placemark-active.svg");
        }
      }
    });
    $(menuElement).mouseleave(function () {
      findInactiveElements();
      for (var i = 0; i < inactiveElements.length; i++) {
        if (this == inactiveElements[i]) {
          placemark.options.set("iconImageHref", "../img/placemark.svg");
        }
      }
    });

    placemark.events
      .add("click", function () {
        resetActiveProperties();
        $(menuElement).addClass("active");
        findActiveElement();
      })
      .add("mouseenter", function (e) {
        e.get("target").options.set(
          "iconImageHref",
          "../img/placemark-active.svg"
        );
        if (!$(menuElement).hasClass("active")) {
          $(menuElement).addClass("placemark-hovered");
        }
      })
      .add("mouseleave", function (e) {
        findInactiveElements();
        for (var i = 0; i < inactiveElements.length; i++) {
          if (menuElement[0] == inactiveElements[i]) {
            e.get("target").options.set(
              "iconImageHref",
              "../img/placemark.svg"
            );
          }
        }
        if (!$(menuElement).hasClass("active")) {
          $(menuElement).removeClass("placemark-hovered");
        }
      });
  }

  myMap.setBounds(myMap.geoObjects.getBounds());

  function resetActiveProperties() {
    $(".map-menu-item").each(function () {
      $(this).removeClass("active placemark-hovered");
    });
    for (var i = 1; i < placemarks.length; i++) {
      placemarks[i].options.set("iconImageHref", "../img/placemark.svg");
    }
  }

  function findActiveElement() {
    $(".map-menu-item").each(function (el) {
      if (!$(this).hasClass("active")) return;
      $(".marker-info").html(markers[el].info);
      placemarks[el + 1].options.set(
        "iconImageHref",
        "../img/placemark-active.svg"
      );
      if (!placemarks[el + 1].balloon.isOpen()) {
        placemarks[el + 1].balloon.open();
      } else {
        placemarks[el + 1].balloon.close();
      }
      return false;
    });
  }

  var inactiveElements;
  function findInactiveElements() {
    inactiveElements = $(".map-menu-item").not(".active");
  }

  $(".map-menu-item").first().addClass("active");
  $(".marker-info").html(markers[0].info);
  placemarks[1].options.set("iconImageHref", "../img/placemark-active.svg");
  placemarks[1].balloon.open();
  findInactiveElements();
}
