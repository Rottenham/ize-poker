// 初始化
var font_kaiti = new FontFace("楷体", "url(kaiti.ttf)");
font_kaiti.load().then(function (font_k) {
  document.fonts.add(font_k);
  var font_poker = new FontFace("Poker", "url(card.ttf)");
  font_poker.load().then(function (font_p) {
    document.fonts.add(font_p);
    submitForm(true);
  });
});
var cvs = document.getElementById("myCanvas");
cvs.width = 1075;
cvs.height = 744;
setDPI(cvs, 300);
var ctx = cvs.getContext("2d");

// 提交表单
// mockup -- 是否使用预设阵图，作为预览
function submitForm(mockup) {
  let author = getAuthors();
  if (!author) {
    return;
  }
  let name = getName();
  if (!name) {
    return;
  }
  let num = getPokerNum();
  let suit = getPokerSuit();
  let mark_type = getPokerMark();
  if (mockup) {
    var puzzle_img = new Image();
    puzzle_img.src = "images/mock_puzzle.png";
  } else {
    var puzzle_img = getImage();
    if (!puzzle_img) {
      return;
    }
  }
  puzzle_img.onload = function (e) {
    if (this.width !== 800) {
      alert("阵图宽度应为800px");
      return;
    }
    if (this.height !== 600) {
      alert("阵图高度应为600px");
      return;
    }
    generatePoker(puzzle_img, author, name, num, suit, mark_type);
  };
}

// 获得作者字符串
function getAuthors() {
  let authors_input = document.getElementsByName("author");
  let authors = new Array();
  for (let i = 0; i < authors_input.length; i++) {
    if (!authors_input[i].value) {
      alert("第" + String(i + 1) + "名作者ID为空");
      return null;
    }
    authors[i] = authors_input[i].value;
  }
  let years_input = document.getElementsByName("year");
  let years = new Array();
  for (let i = 0; i < years_input.length; i++) {
    if (!years_input[i].value) {
      alert("第" + String(i + 1) + "个年份为空");
      return null;
    }
    years[i] = years_input[i].value;
  }
  if (authors.length != years.length) {
    alert("作者ID数与年份数不匹配");
    return null;
  }
  if (authors.length === 0) {
    alert("作者ID输入为空");
    return null;
  }
  let ans = "";
  while (authors.length > 0) {
    auth_list = "";
    let min_year = parseInt(years[0]);
    for (let i = 1; i < years.length; i++) {
      if (parseInt(years[i]) < min_year) {
        min_year = years[i];
      }
    }
    min_year = String(min_year);
    for (let i = 0; i < years.length; ) {
      if (years[i] === min_year) {
        if (auth_list.length > 0) {
          auth_list += "，";
        }
        auth_list += authors[i];
        authors.splice(i, 1);
        years.splice(i, 1);
      } else {
        i++;
      }
    }
    if (ans.length > 0) {
      ans += "，";
    }
    ans += auth_list + " (" + min_year + ")";
  }
  return ans;
}

// 获得珍珑名
function getName() {
  let name = document.getElementById("name").value;
  if (!name) {
    alert("珍珑名为空");
    return null;
  }
  return name;
}

// 获得点数
function getPokerNum() {
  let e = document.getElementById("poker_num");
  return e.options[e.selectedIndex].text;
}

// 获得花色
function getPokerSuit() {
  let e = document.getElementById("poker_suit");
  return e.value;
}

// 获得角标
function getPokerMark() {
  let e = document.getElementById("poker_mark");
  return e.options[e.selectedIndex].text;
}

// 获得阵图
function getImage() {
  let file = document.getElementById("file");
  if (file.files.length === 0) {
    alert("未上传阵图");
    return null;
  }
  let img = new Image();
  img.src = URL.createObjectURL(file.files[0]);
  return img;
}

// 绘制
function generatePoker(puzzle_img, author, name, num, suit, mark_type) {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  drawWhiteBackground(ctx);
  drawAuthor(ctx, author);
  drawName(ctx, name);
  night_img = new Image();
  night_img.src = "images/night.png";
  night_img.onload = function (e) {
    ctx.drawImage(night_img, 78, 72);
    ctx.drawImage(puzzle_img, 138, 72);
    frame_img = new Image();
    frame_img.src = "images/frame.png";
    frame_img.onload = function (e) {
      ctx.drawImage(frame_img, 0, 0);
      poem_img = new Image();
      poem_img.src = "images/poem.png";
      poem_img.onload = function (e) {
        ctx.drawImage(poem_img, 0, 0);
        if (num === "小王") {
          number_img = new Image();
          number_img.src = "images/little_joker.png";
          number_img.onload = function (e) {
            ctx.drawImage(number_img, 0, 0);
            drawMark(ctx, mark_type);
          };
        } else if (num === "大王") {
          number_img = new Image();
          number_img.src = "images/big_joker.png";
          number_img.onload = function (e) {
            ctx.drawImage(number_img, 0, 0);
            drawMark(ctx, mark_type);
          };
        } else {
          suit_img = new Image();
          suit_img.src = getSuitImage(suit);
          suit_img.onload = function (e) {
            drawSuit(ctx, suit_img);
            if (num === "10") {
              number_img = new Image();
              number_img.src = isRed(suit)
                ? "images/10_red.png"
                : "images/10.png";
              number_img.onload = function (e) {
                ctx.drawImage(number_img, 0, 0);
                drawMark(ctx, mark_type);
              };
            } else {
              drawNumber(ctx, num, suit);
              drawMark(ctx, mark_type);
            }
          };
        }
      };
    };
  };
}

// 绘制白底
function drawWhiteBackground(ctx) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  ctx.fillStyle = "black";
}

// 绘制珍珑作者
function drawAuthor(ctx, author) {
  ctx.textAlign = "left";
  ctx.font = "25px 楷体";
  ctx.fillText(author, 77, 50);
}

// 绘制珍珑名
function drawName(ctx, name) {
  ctx.textAlign = "right";
  ctx.font = "29.17px 楷体";
  ctx.fillText(name, 998, 707);
  ctx.textAlign = "left";
}

// 返回某花色是否为红色（红桃、方片）
function isRed(suit) {
  return suit === "HEART" || suit === "DIAMOND";
}

// 返回花色对应的图标文件名
function getSuitImage(suit) {
  return "images/suit_" + suit.toLowerCase() + ".png";
}

// 绘制花色
function drawSuit(ctx, suit_img) {
  ctx.save();
  ctx.translate(972, 20);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(suit_img, 0, 0);
  ctx.restore();
  ctx.save();
  ctx.translate(103, 724);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(suit_img, 0, 0);
  ctx.restore();
}

// 绘制角标
function drawMark(ctx, mark_type) {
  mark_img = new Image();
  if (mark_type === "开局") {
    mark_img.src = "images/kai_mark.png";
  } else if (mark_type === "残局") {
    mark_img.src = "images/can_mark.png";
  } else if (mark_type === "满局") {
    mark_img.src = "images/man_mark.png";
  } else if (mark_type === "坑杀") {
    mark_img.src = "images/keng_mark.png";
  } else if (mark_type === "特殊") {
    mark_img.src = "images/te_mark.png";
  }
  mark_img.onload = function (e) {
    ctx.drawImage(mark_img, 1010, 650);
  };
}

// 绘制数字
function drawNumber(ctx, num, suit) {
  ctx.save();
  ctx.fillStyle = isRed(suit) ? "#fc0303" : "#000000";
  ctx.translate(987, 16);
  ctx.rotate(Math.PI / 2);
  ctx.textAlign = "left";
  ctx.font = "80px Poker";
  ctx.fillText(num, 0, 0);
  ctx.restore();
  ctx.save();
  ctx.fillStyle = isRed(suit) ? "#fc0303" : "#000000";
  ctx.translate(89, 728);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "left";
  ctx.font = "80px Poker";
  ctx.fillText(num, 0, 0);
  ctx.restore();
}

// 设置分辨率
function setDPI(canvas, dpi) {
  canvas.style.width = "537px";
  canvas.style.height = "372px";
  // Resize canvas and scale future draws.
  var scaleFactor = dpi / 72;
  canvas.width = Math.ceil(canvas.width * scaleFactor);
  canvas.height = Math.ceil(canvas.height * scaleFactor);
  var ctx = canvas.getContext("2d");
  ctx.scale(scaleFactor, scaleFactor);
}

// 如果点数为大/小王，禁用花色
function handleNum() {
  let e = document.getElementById("poker_suit");
  e.disabled = getPokerNum() === "小王" || getPokerNum() === "大王";
}

// 增加一个作者/年份
function add_one() {
  let size = document.getElementsByName("author").length;
  if (size >= 5) {
    return;
  }
  var new_item = document.createElement("li");
  new_item.setAttribute("id", "author_item_" + String(size + 1));
  var author = document.createElement("input");
  author.setAttribute("type", "text");
  author.setAttribute("name", "author");
  new_item.appendChild(author);
  var year = document.createElement("input");
  year.setAttribute("type", "number");
  year.setAttribute("name", "year");
  new_item.appendChild(year);
  var authors = document.getElementById("authors");
  authors.insertBefore(new_item, document.getElementById("anchor"));
}

// 减少一个作者/年份
function delete_one() {
  let size = document.getElementsByName("author").length;
  if (size === 1) {
    return;
  }
  document.getElementById("author_item_" + size).remove();
}

// 清空作者输入栏与珍珑名
function delete_until_one() {
  let size = document.getElementsByName("author").length;
  for (let i = 2; i <= size; i++) {
    document.getElementById("author_item_" + i).remove();
  }
  document.getElementsByName("author")[0].value = "";
  document.getElementsByName("year")[0].value = "";
  document.getElementById("name").value = "";
}
