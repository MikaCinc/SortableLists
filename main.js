var Tabs = [
    {
        ID: 0,
        Title: "Jabuka",
        Content: [
            {
                ID: 0,
                Title: "Zelena",
                Price: 3
            },
            {
                ID: 1,
                Title: "Žuta",
                Price: 5
            },
            {
                ID: 2,
                Title: "Crvena",
                Price: 7
            },
        ]
    },
    {
        ID: 1,
        Title: "Kukuruz",
        Content: [
            {
                ID: 0,
                Title: "Pečeni",
                Price: 8
            },
            {
                ID: 1,
                Title: "Kuvani",
                Price: 10
            },
        ]
    },
];

var Current = 0;

window.onload = () => {
    render();
}

const initSortable = () => {
    sortTabs();
    sortRows();
    
}

const sortTabs = () => {
    var el = document.getElementById('tabsMenu');

    var options = {
        handle: ".dragTabTrigger",
        animation: 100,
        store: {
            get: function () {
                var elems = document.getElementsByClassName("tabs");
                var order = [];

                for (let i = 0; i < elems.length; i++) {
                    order.push(parseInt(elems[i].getAttribute("data-id"), 10));
                }

                return order;
            },

            set: function () {
                var order = [...sortable.toArray()];
                var tabs = [...Tabs];

                for (let i = 0; i < tabs.length; i++) {
                    Tabs[i] = findByID(parseInt(order[i], 10), tabs)
                }

                render();
            }
        }
    }
    var sortable = Sortable.create(el, options);
}

const sortRows = () => {
    var el = document.getElementById('draggableTarget');
    
    var currentTab = findByID(Current, Tabs);
    var options = {
        handle: '.dragSpan',
        animation: 100,
        store: {
            get: function () {
                var elems = document.getElementsByClassName("draggableRow");
                var order = [];

                for (let i = 0; i < elems.length; i++) {
                    order.push(parseInt(elems[i].getAttribute("data-id"), 10));
                }

                return order;
            },

            set: function (sortable) {
                var order = [...sortable.toArray()];
                var content = [...currentTab.Content];

                for (let i = 0; i < content.length; i++) {
                    currentTab.Content[i] = findByID(parseInt(order[i], 10), content)
                }
            }
        }
    }
    Sortable.create(el, options);
}

const render = () => {
    document.body.innerHTML = "";
    var tabs = document.createElement("div");
    var content = document.createElement("div");

    tabs.id = "tabsMenu";
    content.id = "content";

    // Clear last render
    tabs.innerHTML = "";
    content.innerHTML = "";

    for (let i = 0; i < Tabs.length; i++) {
        // TABS
        var tab = document.createElement("div");
        tab.className = Tabs[i].ID === Current ? "tabs active" : "tabs";
        tab.setAttribute("data-id", Tabs[i].ID);

        // DRAG icon
        var dragSpan = document.createElement("span");
        var dragIcon = document.createTextNode("☰");
        dragSpan.appendChild(dragIcon);
        dragSpan.className = "dragTabTrigger";
        tab.appendChild(dragSpan);

        // TITLE SPAN
        var titleSpan = document.createElement("span");
        titleSpan.innerHTML = Tabs[i].Title;
        titleSpan.className = "tabTitle";
        titleSpan.onclick = () => {
            Current = Tabs[i].ID;
            render();
        }
        tab.appendChild(titleSpan);

        // PEN icon
        var penSpan = document.createElement("span");
        var penIcon = document.createTextNode("✎");
        penSpan.appendChild(penIcon);
        penSpan.className = "tabButtons";
        penSpan.onclick = () => {
            changeTabTitle(i, prompt("Enter new title here:"));
        }
        tab.appendChild(penSpan);

        // X icon
        var xSpan = document.createElement("span");
        var xIcon = document.createTextNode("✖");
        xSpan.appendChild(xIcon);
        xSpan.className = "tabButtons";
        xSpan.onclick = () => {
            deleteTab(Tabs[i].ID);
        }
        tab.appendChild(xSpan);

        // TAB ONCLICK EVENT
        /* tab.onclick = () => {
            Current = Tabs[i].ID;
            render();
        } */

        // Append to the tabs div
        tabs.appendChild(tab);

        var rows = document.createElement("div");
        rows.id = "draggableTarget"

        // CONTENT
        if (Tabs[i].ID === Current) {
            for (let n = 0; n < Tabs[i].Content.length; n++) {
                var row = document.createElement("div");
                row.className = "draggableRow";
                row.setAttribute("data-id", Tabs[i].Content[n].ID)

                // Dragging icon:

                var dragSpan = document.createElement("span");
                dragSpan.innerHTML = "⥮";
                dragSpan.className = "dragSpan";

                row.appendChild(dragSpan);

                // INPUTS

                var firstInput = document.createElement("input");
                firstInput.value = Tabs[i].Content[n].Title;
                firstInput.className = "contentInput";
                firstInput.onchange = (e) => {
                    handleInput(Tabs[i].ID, Tabs[i].Content[n].ID, "Title", e.target.value);
                }

                row.appendChild(firstInput)

                var secondInput = document.createElement("input");
                secondInput.value = Tabs[i].Content[n].Price;
                secondInput.className = "contentInput w-50";
                secondInput.onchange = (e) => {
                    handleInput(Tabs[i].ID, Tabs[i].Content[n].ID, "Price", e.target.value);
                }

                row.appendChild(secondInput)

                // X row icon
                let rowxSpan = document.createElement("span");
                let rowxIcon = document.createTextNode("✖");
                rowxSpan.appendChild(rowxIcon);
                rowxSpan.className = "rowDeleteButton";
                rowxSpan.onclick = () => {
                    deleteRow(Tabs[i].ID, Tabs[i].Content[n].ID);
                }
                row.appendChild(rowxSpan);

                rows.appendChild(row);
            }

            content.appendChild(rows);

            // Content buttons

            var AddRow = document.createElement("button");
            AddRow.className = "ContentButtons";
            AddRow.innerHTML = "New row";
            AddRow.onclick = () => {
                addRow(Tabs[i].ID);
            }

            content.appendChild(AddRow);
        }
    }

    // NEW TAB BUTTON
    var plusButton = document.createElement("div");
    plusButton.id = "newTabButton";
    plusButton.innerHTML = "+";
    plusButton.onclick = () => {
        addTab();
    }

    // Append to body at the end
    document.body.appendChild(tabs);
    document.body.appendChild(plusButton);
    document.body.appendChild(content);


    // Init sortable at the end
    initSortable();
}

const changeTabTitle = (ID, Title) => {
    if (!Title || !Title.length) return;

    Tabs[ID].Title = Title;
    render();
}

const deleteTab = (ID) => {
    //if (!ID || !Title.length) return;

    if (confirm("Are you sure?")) {
        Tabs = Tabs.filter((tab) => {
            if (tab.ID === ID) return false;
            return true
        });

        render();
    }

}

const addTab = () => {
    var newTab = {
        ID: Math.floor(Math.random() * 1000),
        Title: prompt("Enter tab title:"),
        Content: []
    };

    if (!newTab.Title || !newTab.Title.length) return;

    Tabs.push(newTab);

    Current = newTab.ID;

    render();
}

const handleInput = (TabID, RowID, label, value) => {
    for (let i = 0; i < Tabs.length; i++) {
        if (Tabs[i].ID === TabID) {
            for (let n = 0; n < Tabs[i].Content.length; n++) {
                if (Tabs[i].Content[n].ID === RowID) {
                    Tabs[i].Content[n][label] = value;
                }
            }
        }
    }

    render();
}

const findByID = (ID, List = Tabs) => {
    for (let i = 0; i < List.length; i++) {
        if (List[i].ID === ID) return List[i];
    }
}

const addRow = (TabID) => {
    var newRow = {
        ID: Math.floor(Math.random() * 1000),
        Title: "",
        Price: ""
    };

    var tab = findByID(TabID, Tabs);

    tab.Content.push(newRow);

    render();
}

const deleteRow = (TabID, RowID) => {
    if (confirm("Are you sure?")) {
        var tab = findByID(TabID);
        tab.Content = tab.Content.filter((row) => {
            if (row.ID === RowID) return false;
            return true;
        });

        render();
    }
}