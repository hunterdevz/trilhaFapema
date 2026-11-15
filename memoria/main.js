scene("inicio", () => {

    add([
        text("Boas vindas ao jogo da memoria!", { size: 32 }),
        pos(center().x, center().y - 40),
        anchor("center")
    ]);

    add([
        text("Clique para jogar", { size: 24 }),
        pos(center().x, center().y + 30),
        anchor("center")
    ]);

    onClick(() => {
        if (!get("musicaTocando").length) {
            const musica = play("musica", {
                volume: 0.3,
                loop: true
            });

            add([
                {
                    idMusica: musica
                },
                "musicaTocando"
            ]);
        }

        go("jogo");
    });
});

go("inicio");