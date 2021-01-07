var size = 10;
var dificultate = 1;
var over = true;
var win = document.querySelector('#win_alert')
var lose = document.querySelector('#lose_alert')
var timer = 0;
var timer_start = false;

function game() {
    timer_start = false;
    var table = document.querySelector('#game')
    if (table.childElementCount > 1) {
        table.innerHTML = " ";
    }
    for (let i = 0; i < size; i++) {
        var row = document.createElement("div");
        row.className = "row";
        row.id = i;
        for (let j = 0; j < size; j++) {
            var cell = document.createElement("div");
            cell.className = "cell";
            cell.style.color = "transparent";
            cell.id = j;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    document.querySelectorAll('.cell').forEach(item => {
        item.addEventListener("click", () => {
            if (item.childElementCount == 1 && over) {
                item.querySelectorAll('i').forEach(el => {
                    el.remove();
                })
            }
            //null value click control-----------------------------------------------------------
            if (item.innerHTML == "" && over) {
                var row_id = item.parentElement.id;
                var column_id = item.id;
                var row_counter = -1;
                var x = 1,
                    y = 1;
                if (row_id == 0) x = 0;
                if (row_id == size - 1) row_counter = 0;
                for (; x >= row_counter; x--) {
                    if (column_id == 0) y = 0;
                    var column_counter = -1;
                    if (column_id == size - 1) column_counter = 0;
                    for (; y >= column_counter; y--) {
                        var cell_row = document.querySelectorAll('.row')[row_id - x];
                        var cell_id = cell_row.querySelectorAll('.cell')[column_id - y];
                        if (cell_id.innerHTML == "" && cell_id.style.background != "white") { cell_id.click(); };
                        if (cell_id.childElementCount == 1 && over) {
                            cell_id.querySelectorAll('i').forEach(el => {
                                el.remove();
                            })
                        }
                        cell_id.style.background = "white";
                        cell_id.style.color = "coral";
                    }
                    if (column_id == 0) y = 0;
                    else y = 1;
                }
            } else {
                //Bomb click  controll-------------------------------------------------------
                if (item.innerHTML == 9 && over) {
                    lose.style.display = "block";
                    document.querySelectorAll('.cell').forEach(elem => {

                        if (elem.childElementCount == 1) {
                            elem.querySelectorAll('i').forEach(el => {
                                el.remove();
                            })
                        }
                        if (elem.innerHTML == 9) {
                            over = false;
                            var icon = document.createElement("i");
                            icon.className = "fas fa-bomb";
                            icon.style.fontSize = "smaller"
                            elem.innerHTML = " ";
                            elem.appendChild(icon);
                            elem.style.color = "coral";
                            elem.style.background = "white";
                        }
                    })
                }
            }
            if (over) {
                item.style.color = "coral";
                item.style.background = "white";
                if (timer_start == false) timer_start = true;
            }
            //win control--------------------------------------------------------------------------------
            var mistake_count = 0;
            if (over) {
                var grid_cell = document.querySelectorAll(".noBomb_cell");
                for (let y = 0; y < grid_cell.length; y++) {
                    if (grid_cell[y].style.color == "transparent")
                        mistake_count++;
                }

                if (mistake_count == 0 && over) {
                    win.style.display = "block"
                    document.querySelectorAll('.cell').forEach(item => {
                        if (item.childElementCount == 1) {
                            item.querySelectorAll('i').forEach(el => {
                                el.remove();
                            })
                        }
                        if (item.innerHTML == 9) {
                            over = false;
                            var icon = document.createElement("i");
                            icon.className = "fas fa-bomb";
                            icon.style.fontSize = "smaller"
                            item.innerHTML = " ";
                            item.appendChild(icon);
                        }
                        item.style.color = "coral";
                        item.style.background = "white";
                    })
                    over = false;
                }
            }
        })
    })
    return 1;
}

function timer_f() {
    var timer_div = document.querySelector('#timer');


    setInterval(() => {
        if (over && timer_start) {
            timer++;
            timer_div.innerHTML = timer;
        } else {
            timer = 0;
            timer_div.innerHTML = timer;
        }
    }, 1000);
}

function right_click() {
    document.querySelectorAll('.cell').forEach(item => {
        item.addEventListener("contextmenu", e => {
            e.preventDefault();
            if (item.style.color != "coral" && over) {
                if (item.childElementCount < 1) {
                    var icon = document.createElement("i");
                    icon.className = "fas fa-flag";
                    icon.style.color = "white"
                    icon.style.fontSize = "smaller";

                    icon.style.position = "absolute"
                    item.appendChild(icon);
                } else {
                    item.querySelector("i").remove();
                }
            }
        })
    })
    return 0;
}

function array() {
    //Create logical array with random numbers---------------------------
    var grid = Array.from(Array(size), () => new Array(size));
    for (let x = 0; x < dificultate; x++)
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (grid[i][j] != 9) grid[i][j] = Math.floor(Math.random() * 10)
            }
        }
        //Count bomb in square------------------------------------------------
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] != 9) {
                var bomb_counter = 0;
                var row_counter = -1;
                var x = 1,
                    y = 1;
                if (i == 0) x = 0;
                if (i == size - 1) row_counter = 0;
                for (; x >= row_counter; x--) {
                    if (j == 0) y = 0;
                    var column_counter = -1;
                    if (j == size - 1) column_counter = 0;
                    for (; y >= column_counter; y--) {
                        if (grid[i - x][j - y] == 9) { bomb_counter++ }
                    }
                    if (j == 0) y = 0;
                    else y = 1;
                }
                grid[i][j] = bomb_counter;

            }
        }
    }
    //Insert numbers in html array-------------------------------------------
    cell_counter = 0; //count no-bomb-cells-------------------------------------
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            var cell = document.querySelectorAll(".row")[i].getElementsByClassName('cell')[j];
            if (grid[i][j] != 0) cell.innerHTML = grid[i][j];
            if (grid[i][j] != 9) cell.classList.add("noBomb_cell");

        }
    }
}
game();
right_click();
array();
timer_f();

document.querySelector("#new_game").addEventListener("click", () => {
    game();
    array();
    right_click();
    over = true;
    timer = 0;
    win.style.display = "none";
    lose.style.display = "none";
})
document.querySelector("#dificultate_plus").addEventListener("click", () => {
    if (dificultate <= size / 2) dificultate += 1;
    game();
    array();
    right_click();
    over = true;
    timer = 0;
    win.style.display = "none";
    lose.style.display = "none";
})
document.querySelector("#dificultate_minus").addEventListener("click", () => {
    if (dificultate >= 2) dificultate -= 1;
    game();
    array();
    right_click();
    over = true;
    timer = 0;
    win.style.display = "none";
    lose.style.display = "none";
})
document.querySelector("#size").addEventListener("click", () => {
    if (size < 20) size += 5;
    game();
    array();
    right_click();
    over = true;
    timer = 0;
    win.style.display = "none";
    lose.style.display = "none";
})
document.querySelector("#size1").addEventListener("click", () => {
    if (size > 5) size -= 5;
    game();
    array();
    right_click();
    timer = 0;
    over = true;
    win.style.display = "none";
    lose.style.display = "none";
})