let musica = null;

scene("inicio", () => {

    add([
        text("JOGO DA VELHA", { size: 48 }),
        pos(center().x, 200),
        anchor("center")
    ]);

    add([
        text("Clique para jogar", { size: 28 }),
        pos(center().x, 350),
        anchor("center")
    ]);

    onClick(() => {

        if (musica === null) {
            musica = play("musica", {
                volume: 0.3,
                loop: true
            });
        }

        go("jogo");
    });

});

go("inicio");