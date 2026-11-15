scene("jogo", () => {

    function fundo() {
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
    }

    fundo();

    const tipo = ["bear", "owl", "crocodile", "penguin"];
    const pool = shuffle(tipo.concat(tipo));

    let selecionada1 = null;
    let selecionada2 = null;
    let acertos = 0;

    const TAM = 140;
    const ESPACO = 24;

    const largura = 4 * TAM + 3 * ESPACO;
    const altura = 2 * TAM + ESPACO;

    const inicioX = (width() - largura) / 2;
    const inicioY = (height() - altura) / 2;

    add([
        rect(largura + 60, altura + 60, { radius: 28 }),
        pos(center()),
        anchor("center"),
        color(60, 62, 122)
    ]);

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 4; j++) {

            const animal = pool.pop();

            const x = inicioX + j * (TAM + ESPACO) + TAM / 2;
            const y = inicioY + i * (TAM + ESPACO) + TAM / 2;

            add([
                rect(TAM, TAM, { radius: 12 }),
                pos(x, y + 8),
                anchor("center"),
                color(0, 0, 0),
                opacity(0.3)
            ]);

            const card = add([
                sprite("verso", { width: TAM, height: TAM }),
                pos(x, y),
                anchor("center"),
                area(),
                scale(1),
                {
                    animal: animal,
                    revelada: false,
                    virando: false
                }
            ]);

            // Movimento suave
            card.onUpdate(() => {
                card.pos.y = y + Math.sin(time() * 1.6) * 2.5;
            });

            // Mouse entrou
            card.onHover(() => {
                setCursor("pointer");
                card.scaleTo(1.08);
            });

            // Mouse saiu
            card.onHoverEnd(() => {
                setCursor("default");
                card.scaleTo(1);
            });

            card.onClick(() => {
                selecionar(card);
            });
        }
    }

    // Animacao de virar
    function virar(card, face) {

        card.virando = true;

        tween(1, 0, 0.12, (x) => {
            card.scale.x = x;
        }).onEnd(() => {

            card.use(sprite(face, {
                width: TAM,
                height: TAM
            }));

            tween(0, 1, 0.12, (x) => {
                card.scale.x = x;
            }).onEnd(() => {
                card.virando = false;
            });
        });
    }

    // Animacao de tremer
    function tremer(card) {

        const x = card.pos.x;

        tween(0, 1, 0.4, (t) => {
            card.pos.x = x + Math.sin(t * 40) * 10 * (1 - t);
        }).onEnd(() => {
            card.pos.x = x;
        });
    }

    function selecionar(card) {

        if (selecionada1 && selecionada2) {
            return;
        }

        if (card.revelada || card.virando) {
            return;
        }

        play("virar", { volume: 0.5 });

        virar(card, card.animal);

        card.revelada = true;

        if (!selecionada1) {
            selecionada1 = card;
        } else {
            selecionada2 = card;
            checarCombinacao();
        }
    }

    function checarCombinacao() {

        if (selecionada1.animal === selecionada2.animal) {

            acertos++;

            selecionada1 = null;
            selecionada2 = null;

            if (acertos === 4) {
                wait(1, () => {
                    go("vitoria");
                });
            }

        } else {

            const carta1 = selecionada1;
            const carta2 = selecionada2;

            wait(0.3, () => {
                play("erro", { volume: 0.5 });
                tremer(carta1);
                tremer(carta2);
            });

            wait(1, () => {

                virar(carta1, "verso");
                virar(carta2, "verso");

                carta1.revelada = false;
                carta2.revelada = false;

                selecionada1 = null;
                selecionada2 = null;
            });
        }
    }
});

scene("vitoria", () => {

    add([
        text("Parabens! Voce venceu!", { size: 32 }),
        pos(center()),
        anchor("center")
    ]);

    wait(3, () => {
        go("inicio");
    });
});