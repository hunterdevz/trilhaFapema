scene("jogo", () => {

    // Fundo animado
    const grade = add([pos(0, 0)]);

    for (let x = -30; x < width() + 60; x += 60) {
        for (let y = -30; y < height() + 60; y += 60) {

            grade.add([
                circle(4),
                pos(x, y),
                color(255, 255, 255),
                opacity(0.07)
            ]);
        }
    }

    grade.onUpdate(() => {
        grade.pos.x = (time() * 20) % 60;
        grade.pos.y = (time() * 10) % 60;
    });

    const TAM = 140;
    const ESPACO = 12;

    const largura = 3 * TAM + 2 * ESPACO;
    const inicioX = (width() - largura) / 2;
    const inicioY = (height() - largura) / 2 + 25;

    let jogador = "X";
    let terminou = false;

    const tabuleiro = ["", "", "", "", "", "", "", "", ""];
    const casas = [];

    const combinacoes = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const aviso = add([
        text("Vez do jogador X", { size: 30 }),
        pos(center().x, 45),
        anchor("center")
    ]);

    add([
        rect(largura + 50, largura + 50, { radius: 25 }),
        pos(center().x, inicioY + largura / 2),
        anchor("center"),
        color(60, 62, 122)
    ]);

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {

            const indice = i * 3 + j;

            const x = inicioX + j * (TAM + ESPACO) + TAM / 2;
            const y = inicioY + i * (TAM + ESPACO) + TAM / 2;

            add([
                rect(TAM, TAM, { radius: 12 }),
                pos(x, y + 6),
                anchor("center"),
                color(0, 0, 0),
                opacity(0.3)
            ]);

            const casa = add([
                rect(TAM, TAM, { radius: 12 }),
                pos(x, y),
                anchor("center"),
                area(),
                color(35, 45, 75),
                scale(1)
            ]);

            casas.push(casa);

            casa.onHover(() => {
                if (!terminou && tabuleiro[indice] === "") {
                    setCursor("pointer");
                    casa.scaleTo(1.05);
                }
            });

            casa.onHoverEnd(() => {
                setCursor("default");
                casa.scaleTo(1);
            });

            casa.onClick(() => {

                if (terminou || tabuleiro[indice] !== "") {
                    return;
                }

                tabuleiro[indice] = jogador;

                play("clique", { volume: 0.5 });

                const simbolo = add([
                    text(jogador, { size: 85 }),
                    pos(x, y),
                    anchor("center"),
                    color(
                        jogador === "X" ? 100 : 255,
                        jogador === "X" ? 220 : 180,
                        jogador === "X" ? 200 : 120
                    ),
                    scale(0.1)
                ]);

                tween(0.1, 1, 0.2, (s) => {
                    simbolo.scaleTo(s);
                });

                verificar();
            });
        }
    }

    function verificar() {

        for (const c of combinacoes) {

            const a = c[0];
            const b = c[1];
            const d = c[2];

            if (
                tabuleiro[a] !== "" &&
                tabuleiro[a] === tabuleiro[b] &&
                tabuleiro[a] === tabuleiro[d]
            ) {

                terminou = true;

                aviso.text = "Jogador " + jogador + " venceu!";

                play("vitoria", { volume: 0.6 });

                // Destacar as casas vencedoras
                for (const indice of c) {
                    casas[indice].color = rgb(40, 130, 100);
                }

                wait(2, () => {
                    go("resultado", "Jogador " + jogador + " venceu!");
                });

                return;
            }
        }

        if (!tabuleiro.includes("")) {

            terminou = true;
            aviso.text = "Empate!";

            wait(2, () => {
                go("resultado", "Deu empate!");
            });

            return;
        }

        if (jogador === "X") {
            jogador = "O";
        } else {
            jogador = "X";
        }

        aviso.text = "Vez do jogador " + jogador;
    }

});
scene("resultado", (mensagem) => {

    add([
        text(mensagem, { size: 40 }),
        pos(center().x, 230),
        anchor("center")
    ]);

    const botao = add([
        rect(300, 70, { radius: 15 }),
        pos(center().x, 380),
        anchor("center"),
        area(),
        color(60, 62, 122)
    ]);

    add([
        text("Jogar novamente", { size: 26 }),
        pos(center().x, 380),
        anchor("center")
    ]);

    botao.onHover(() => {
        setCursor("pointer");
    });

    botao.onHoverEnd(() => {
        setCursor("default");
    });

    botao.onClick(() => {
        setCursor("default");
        go("jogo");
    });

});