let canvas, ctx; // definiranje canvas i context varijabli
let canvasWidth; // definiranje canvas širine varijable
let canvasHeight; // definiranje canvas visine varijable

canvas = document.getElementById("central"); // dohvaćanje canvasa pomoću id-a central
canvas.width = window.innerWidth; // postavljam canvas širina na veličinu cijelog prozora web preglednika
canvas.height = window.innerHeight; // ovdje postavljam canvas visinu na visinu cijelog prozora web preglednika
canvasWidth = canvas.width; // postavljam vrijednost širine u varijablu canvasWidth
canvasHeight = canvas.height; // postavljam vrijednost visine u varijablu canvasHeight
ctx = canvas.getContext("2d"); // kreiranje konteksta za canvas, služi za crtanje po canvasu

// paddle.x = (canvasWidth - paddle.width) / 2; // definiram gdje će na x osi započeti moja palica, 
// paddle.y = canvasHeight - paddle.height - 5; // definiram gdje će na y osi započeti moja palica

document.addEventListener("keydown", handleKeyDown); // na trenutnom document objektu slušam da li se događa određeni
// događaj, u ovom slučaju hoće li korisnik kliknuti neku tipku na tipkovnici, te ako klikne tada se poziva handleKeyDown funkcija

let paddle = { // definiranje palice
    width: canvasWidth*0.1, // širina
    height: 10, // visina
    x: (canvasWidth - canvasWidth*0.1) / 2, // x koordinata palice, gdje će palica početi
    y: canvasHeight - 10 - 5, // y koordinata palice, gdje će početi
    speed: 20 // brzina kojom se palica pomiče po x osi
};

let ball = { // definiranje loptice
    size: 12, // veličina loptice
    x: canvasWidth / 2, // x koordinata loptice, gdje će se nalaziti po x osi
    y: canvasHeight - 25, // y koordinata loptice, gdje će se nalaziti po y osi
    velocityX: 0, // brzina loptice po x osi
    velocityY: 0 // brzina loptice po y osi
};

let blocks = []; // definiranje liste blokova
let blockProps = { // definiranje atributa uz blokove
    width: canvasWidth*0.1, // širina bloka
    height: canvasHeight*0.03, // visina bloka
    columns: 9, // broj stupaca blokova
    rows: 3, // broj redaka blokova
    padding: canvasWidth*0.01, // razmak između blokova
    offsetX: canvasWidth*0.01, // pomak blokova od lijeve strane canvasa, odnosno pomak na x osi
    offsetY: canvasHeight*0.07 // pomak blokova od vrha canvasa, odnosno pomak na y osi
};

let gameStatus = { // ovdje definiram status svake igre koju netko igra
    score: 0, // trenutni score osobe koja igra
    maxScore: 0, // najveći score kojeg je netko postigao
    isGameOver: false, // zastavica koja govori je li igra završena ili ne
    newHighScoreFlag: false // zastavica koja mi govori je li dobiven novi highscore te s time puštam zvuk za novi highscore
};

const sounds = { // definiram objekt sounds u kojem su mi pohranjeni svi zvukovi za aplikaciju
    blockBreak: new Audio('crate-break-1-93926.mp3'), // zvuk prilikom razbijanja bloka
    wallBounce: new Audio('rubberballbouncing-251948.mp3'), // zvuk prilikom odbijanja loptice od zid i palicu
    gameOver: new Audio('game-over-arcade-6435.mp3'), // zvuk kada igra završi ali kada loptica padne
    win: new Audio('mixkit-video-game-win-2016.wav'), // zvuk kada igra završi ali uspješno
    highScore: new Audio('in-game-level-uptype-2-230567.mp3') // zvuk kada postaviš novi highscore
};

resetBall(); // pozivam funkciju koja će postaviti početne vrijednosti za lopticu
generateBlocks(); // pozivam funkciju koja će generirati blokove
gameStatus.maxScore = localStorage.getItem('maxScore') || 0; // postavljam vrijednost varijable maxScore na vrijednost koja 
// je postavljena u localStorageu ili ako ne postoji tada je vrijednost 0

// resetBall(); // pozivam funkciju koja će postaviti početne vrijednosti za lopticu
// function init() { // funkcija kojom inicijaliziram početne vrijednosti canvasa i palice, početna funkcija koju pozivam
// canvas = document.getElementById("central"); // dohvaćanje canvasa pomoću id-a central
// canvas.width = window.innerWidth - 10; // postavljam canvas širina na veličinu cijelog prozora web preglednika ali smanjenu za 10 jer je potrebno staviti vidljivi rub
// canvas.height = window.innerHeight - 10; // ovdje postavljam canvas visinu na visinu cijelog prozora web preglednika te ga ponovno smanjujem za 10 zbog vidljivog ruba
// canvasWidth = canvas.width; // postavljam vrijednost širine u varijablu canvasWidth
// canvasHeight = canvas.height; // postavljam vrijednost visine u varijablu canvasHeight
// ctx = canvas.getContext("2d"); // kreiranje konteksta za canvas, služi za crtanje po canvasu

// paddle.x = (canvasWidth - paddle.width) / 2; // definiram gdje će na x osi započeti moja palica, 
// paddle.y = canvasHeight - paddle.height - 5; // definiram gdje će na y osi započeti moja palica

// resetBall(); // pozivam funkciju koja će postaviti početne vrijednosti za lopticu
// gameStatus.maxScore = localStorage.getItem('maxScore') || 0; // postavljam vrijednost varijable maxScore na vrijednost koja 
// // je postavljena u localStorageu ili ako ne postoji tada je vrijednost 0

// document.addEventListener("keydown", handleKeyDown); // na trenutnom document objektu slušam da li se događa određeni
// // događaj, u ovom slučaju hoće li korisnik kliknuti neku tipku na tipkovnici, te ako klikne tada se poziva handleKeyDown funkcija
// generateBlocks(); // pozivam funkciju koja će generirati blokove
// requestAnimationFrame(gameLoop); // ugrađena JavaScript funkcija koja poziva callback funkciju, u ovom slučaju gameLoop
// }

function resetBall() {// funkcija koja resetira lopticu na način da je postavi na sredinu palice i stavi random kut kretanja
    let angle = (Math.random() * (150 - 30) + 30) * (Math.PI / 180); // Math.random() vraća slučajan broj između 0 i 1 te to množim 
    //sa brojem 120, a dodavanje broja 30 mi omogućava da minimalni kut bude 30 stupnjeva, a maksimalni kut bude 150, te nakon toga 
    //pomoću Math.PI/180 stupnjeve pretvaram u radijane
    // ball.x = canvasWidth / 2; // postavljanje x koordinate loptice na širinu canvasa podijeljenu sa 2, to jest sredina palice
    // ball.y = paddle.y - ball.size; // y koordinata loptice će biti y koordinata palice umanjena za večinu loptice
    ball.velocityX = 4 * Math.cos(angle); // brzina loptice po x osi, 4 je konstantna brzina no množenjem s kosinusom kuta
    // dobivamo pozitivnu ili negativnu vrijednost što nam govori hoće li se loptica gibati u pozitivnom ili negativnom smjeru po x osi 
    ball.velocityY = -Math.abs(4 * Math.sin(angle));// ovdje računamo brzinu loptice po y osi, početna brzina je 4 kao i kod x osi,
    // ali sinusom kuta dobivamo vrijednost između -1 i 1 te time određujemo koliko će brzine ići gore ili dolje, to množimo sa 4 te
    // nam to daje vertikalnu komponentu brzine, stavljamo Math.abs() na tu vrijednost kako bi uvijek dobili pozitivne vrijednosti
    // i onda to pretvaram u negativnu vrijednost jer početno želim da loptica ide prema gore
}

function gameLoop() { // funkcija koja iznova kreira sve moje objekte u canvasu
    if (gameStatus.isGameOver) return; // provjeravam je li zastavica za kraj igre podignuta, u tom trenutku završavam igru
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // svaki put čisti cijeli canvas kako bi postavio nove elemente

    drawPaddle(); // funkcija koju pozivam za crtanje palice
    updateBall(); // funkcija koja pozivam za promjenu pozicije loptice, je li izašla iz okvira i je li uništila neki blok
    drawBall(); // funkcija koja crta lopticu u canvasu, to jest postavlja lopticu u canvas
    drawBlocks(); // funkcija za crtanje blokova
    drawScore(); // funkcija koja crta score, maxScore, provjera je li došlo do promjene scora, postavljanja novog highscora te puštanja zvuka

    requestAnimationFrame(gameLoop); // ugrađena JavaScript funkcija koja poziva svoju callback funkciju u ovom slučaju to je
    // gameLoop, ona se iznova poziva svaki puta kada je potrebno osvježiti ekran odnosno želimo promjeniti poziciju ili izgled
    // nekog od objekata u canvasu te se ta funkcija svaki put poziva
}

function drawPaddle() { // funkcija za crtanje palice
    // ctx.fillStyle = createRadialGradient(paddle, "red", "pink");
    // ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.fillStyle = "red"; // svojstvo fillStyle nam omogućava da postavimo boju punjenja, u ovom slučaju na crvenu, 
    // te svi oblici koje se crtaju nakon ovog imat će crvenu boju
    ctx.shadowColor = "red"; // ovdje postavljam koja boja će se koristiti za sjenu, ponovno crvena
    ctx.shadowBlur = 20; // definiram koliko će biti zamućena sjena
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height); // funkcija za crtanje pravokutnika, prve 2 vrijednosti određuju
    // od kud će početi pravokutnik, a posljednje 2 određuju koliku širinu i visinu će imati taj pravokutnik

    ctx.shadowColor = "transparent"; // postavljam boju sjene na transparentno što isključuje sjenu za buduće objekte, osim ako
    // sam ne postavim
}

function updateBall() { // funkcija za osvježavanje pozicije loptice, je li loptica pogodila neki dio canvasa i je li uništila neki blok
    ball.x += ball.velocityX; // mijenjam x koordinatu loptice pomaknutu za brzinu loptice po x osi
    ball.y += ball.velocityY; // mijenjam y koordinatu loptice pomaknutu za brzinu loptice po y osi

    if (ball.x <= 0 || ball.x + ball.size >= canvasWidth) { // provjeravam je li loptica dotakla lijevu stranu canvasa ili desnu stranu canvasa
        ball.velocityX *= -1; // ako je tada mijenjam smjer njene brzinu po x osi u suprotan
        sounds.wallBounce.play(); // i puštam zvuk udaranja loptice o zid
    }

    if (ball.y <= 0) { // provjera je li loptica dotakla strop, gornji dio canvasa
        ball.velocityY *= -1; // ako je tada mijenjam smjer loptice po y osi u suprotan smjer
        sounds.wallBounce.play(); // i puštam zvuk udaranja loptice o zid
    }

    if (ball.y + ball.size >= canvasHeight) { // provjera je li loptica dotakla donji dio canvasa, odnosno je li izašla izvan okvira
        endGame("GAME OVER"); // tada pozivam funkciju endGame sa porukom, ta funkcija izvršava kraj igre to jest gubitak igre
        sounds.gameOver.play(); // i puštam zvuk koji definira kraj igre
    }

    if (detectCollision(ball, paddle)) { // provjera je li došlo do sudara loptice sa palicom, pozivam funkciju koja određuje sudar
        let relativeHitPos = (ball.x + ball.size / 2 - paddle.x) / paddle.width; // postavljam varijablu relativna pozicija udarca
        // loptice, sa ball.x+ball.size/2 dobivam središte loptice te oduzimanjem početne pozicije palice i dijeljenja sa širinom
        // palice dobivam relativnu poziciju udarca loptice u rasponu od 0 do 1
        relativeHitPos = relativeHitPos * 2 - 1; // mijenjam opseg udarca sa intervala [0,1] na interval [-1,1], centar je 0, a
        // lijevi i desni kraj predstavljaju -1, to jest 1

        let bounceAngle = relativeHitPos * (Math.PI / 3) + Math.PI / 2; // računam kut odbijanja loptice

        let speed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2); // računam brzinu loptice pomoću Pitagore
        ball.velocityX = speed * Math.cos(bounceAngle); // postavljam novu brzinu loptice po x osi, ponovno pomoću kosinusa uz kut odbijanja loptice
        ball.velocityY = -Math.abs(speed * Math.sin(bounceAngle)); // postavljam novu brzinu loptice po y osi, također pomoću
        // sinusa nad kutom odbijanja loptice, minus osigurava da loptica ide prema gore

        sounds.wallBounce.play(); // puštam zvuk kada se loptica sudari sa palicom
    }

    blocks.forEach((block, index) => { // pozivam forEach funkciju nad svakim blokom koji se nalazi u varijabli blocks
        if (!block.isBroken && detectCollision(ball, block)) { // za svaki blok provjeravam ako još nije uništen te ako je došlo do kolozije sa lopticom napravi sljedeće
            ball.velocityY *= -1; // u slučaju uništenja bloka, promjeni brzinu loptice po y osi u suprotan smjer, to jest stavi da ide gore ili dolje
            block.isBroken = true; // postavi zastavicu da je taj blok uništen
            gameStatus.score++; // povećaj score za 1
            sounds.blockBreak.play(); // pusti zvuk uništenja bloka
            if (blocks.every(b => b.isBroken)) winGame(); // provjera pomoću funkcije every() koja provjerava da li svi elementi
            // nekog niza, u ovom slučaju niza blocks, zadovoljavaju neki uvjet, to jest ako je svaki blok uništen onda pozovi
            // funkciju winGame() kojom se određuje kraj igre pobjedom
        }
    });
}

function drawBall() { // funkcija za crtanje loptice
    ctx.fillStyle = "white"; // postavljam boju punjenja na bijelu
    ctx.beginPath(); // funkcija koja započinje novu putanju na canvasu
    ctx.arc(ball.x + ball.size / 2, ball.y + ball.size / 2, ball.size / 2, 0, Math.PI * 2); // arc je funkcija koja crta kružnicu,
    // vrijednosti ball.x+ball.size/2 i ball.y+ball.size/2 predstavljaju x i y koordinate centra kružnice, ball.size/2 predstavlja
    // polumjer kružnice, 0 i Math.PI*2 nam predstavljaju početni i završni kut kružnice
    ctx.fill(); // i ova funkcija popunjava definirani oblik sa željenom bojom, u ovom slučaju sa bijelom
}

function generateBlocks() { // funkcija za generiranje svih blokova
    blocks = []; // početno postavljam varijablu blocks kao praznu listu
    for (let i = 0; i < blockProps.columns; i++) { // for petlja koja ide od 0 do broja stupaca
        for (let j = 0; j < blockProps.rows; j++) { // for petlja koja ide od 0 do broja redaka
            blocks.push({ // dodaj blok u blocks listu
                x: blockProps.offsetX + i * (blockProps.width + blockProps.padding), // x koordinata svakog bloka, svaki blok će imati
                // vrijednost offsetX koji je udaljenost bloka od lijeve strane canvasa, zatim u ovisnosti o varijabli i, dodajemo
                // vrijednost width koji je predefinirana širina bloka kako bi otišli u novi stupac i to uvećano za padding koji
                // predstavlja udaljenost između samih blokova, u ovisnosti o veličini same varijable i ta udaljenost se povećava
                y: blockProps.offsetY + j * (blockProps.height + blockProps.padding), // y koordinata svakog bloka, slično kao i kod
                // x koordinate, postavljamo početno na vrijednost varijable offsetY što predstavlja udaljenost bloka od gornjeg dijela
                // canvasa, zatim u ovisnosti o varijabli j koju množimo sa varijablama height + padding, height je predefinirana 
                // visina svakog bloka, a padding je ponovno razmak između svakog bloka, te nam to pomnoženo sa j omogućuje da dodajemo
                // nove retke u koje ćemo stavljati nove blokove
                width: blockProps.width, // širina svakog bloka je predefinirana
                height: blockProps.height, // visina svakog bloka je predefinirana
                isBroken: false // svaki blok na početku ima varijablu isBroken na false jer na početku svaki blok postoji
            });
        }
    }
}

function drawBlocks() { // funkcija za crtanje blokova
    ctx.shadowColor = "green"; // postavljam boju koja će se koristiti za sjenu, ovdje je to zelena
    ctx.shadowBlur = 20; // postavljam zamućenost sjene koja će biti 20
    blocks.forEach(block => { // pozivam funkciju forEach koja ide po lista blokova, blocks
        if (!block.isBroken) { // provjeravam postoji li određeni blok i dalje
            // ctx.fillStyle = createLinearGradient(block, "darkgreen", "lightgreen");
            ctx.fillStyle = "green"; // ako postoji tada postavljam boju za punjenje na zelenu
            ctx.fillRect(block.x, block.y, block.width, block.height); // te crtam pravokutnik koji ima početne koordinate block.x
            // i block.y te širinu i visinu postavljenu na block.width i block.height
        }
    });
}

function handleKeyDown(e) { // funkcija koja se poziva kada se detektira da je korisnik kliknuo na neki gumb na tipkovnici
    if (e.code === "ArrowLeft" && paddle.x > 0) { // ako je dotaknut gumb lijeva strelica i palica nije izašla izvan canvas okvira
        paddle.x -= paddle.speed;                 // ako je uvjet zadovoljen, tada pomakni palicu ulijevo     
    } else if (e.code === "ArrowRight" && paddle.x + paddle.width < canvasWidth) { // ako je dotaknut gumb desna strelica i palica neće izaći izvan canvas okvira
        paddle.x += paddle.speed;                                                  // tada palica pomakni udesno
    }
}

function detectCollision(ball, rect) { // funkcija za provjeru kolizija između loptice i pravokutnika(blokova i palice)
    let distX = Math.abs(ball.x + ball.size / 2 - rect.x - rect.width / 2); // ovdje računam horizontalnu udaljenost između centra
    // loptice i centra palice ili bloka
    let distY = Math.abs(ball.y + ball.size / 2 - rect.y - rect.height / 2); // ovdje računam vertikalnu udaljenost između centra
    // loptice i centra palice ili bloka

    if (distX > (rect.width / 2 + ball.size / 2)) return false; // ako je horizontalna udaljenost veća od polovice širine pravokutnika
    // zbrojeno sa polovicom veličine loptice tada nema sudara, vrati false
    if (distY > (rect.height / 2 + ball.size / 2)) return false; // ako je vertikalna udaljenost veća od polovice visine pravokutnika
    // zbrojeno sa polovicom veličine loptice tada nema sudara, vrati false

    if (distX <= (rect.width / 2)) return true; // ako je horizontalna udaljenost manja ili jednaka polovici širine pravokutnika, to
    // znači da je loptica unutar ili na rubu pravokutnika, došlo je do sudara, vrati true
    if (distY <= (rect.height / 2)) return true; // ako je vertikalna udaljenost manja ili jednaka polovici širine pravokutnika, to
    // znači da je loptica unutar ili na rubu pravokutnika, došlo je do sudara, vrati true

    let dx = distX - rect.width / 2; // u slučaju da udaljenost po x-u nisu bile dovoljno male da utvrde koliziju, ovdje se računa
    // koliko je loptica izvan pravokutnika po horizontalnoj osi
    let dy = distY - rect.height / 2; // isto kao i gornja varijabla, samo se računa po vertikalnoj osi
    return (dx * dx + dy * dy <= (ball.size / 2) * (ball.size / 2)); // ako je udaljenost između loptice i pravokutnika manja ili
    // jednaka polumjera loptice onda je došlo do sudar, vrati true, u suprotnom false
}

function drawScore() { // funkcija koja crta score i maxScore na canvasu
    ctx.fillStyle = "green"; // postavi boju za punjenje na zelenu
    ctx.font = "20px sans-serif"; // postavljanje stila i veličine fonta za tekst
    ctx.fillText(`score: ${gameStatus.score}`, canvasWidth - 220, 25); // crtam tekst score na canvasu na određenoj širini i visini
    ctx.fillText(`max score: ${localStorage.getItem('maxScore') || 0}`, canvasWidth - 135, 25); // isto crtam maxScore na canvasu na 
    //definiranoj širini i visini
    if (gameStatus.score > gameStatus.maxScore && !gameStatus.newHighScoreFlag) { // provjera je li novi score u igrici prešao trenutni
        // maxScore te je li varijabla newHighScoreFlag postavljena na false, tada je postavljen novi highscore i nastavi dalje
        gameStatus.newHighScoreFlag = true; // postavi zastavicu newHighScoreFlag na true kako ne bi svaki put zvali da je novi highscore
        sounds.highScore.play(); // pusti zvuk prilikom novog highscora
    }
}

function winGame() { // funkcija koja se poziva kada igrač završi igru ali uništio je sve blokove
    ctx.fillStyle = "white"; // postavi boju za punjenje na bijelu
    ctx.font = "50px sans-serif"; // postavi stil i veličinu fonta za tekst
    ctx.fillText("YOU WON!!!", canvasWidth / 2 - 140, canvasHeight / 2); // crtam tekst you won na canvas na određenoj širini i visini
    gameStatus.isGameOver = true; // postavi zastavicu isGameOver na true, to jest igra je završila
    localStorage.setItem('maxScore', gameStatus.score); // postavi u localStorageu item maxScore na novi score
    sounds.win.play(); // puštam zvuk kada igrač završi igru pobjedom
}

function endGame(message) { // funkcija koja se poziva kada igrač završi igru ali ne uspješno
    ctx.fillStyle = "white"; // postavljam boju za punjenje na bijelu
    ctx.font = "50px sans-serif"; // postavljam stil i veličinu fonta za tekst
    ctx.fillText(message, canvasWidth / 2 - 140, canvasHeight / 2); // u ovisnosti o poruci, nacrtaj tekst na canvasu na određenoj
    // visini i širini
    gameStatus.isGameOver = true; // postavi zastavicu isGameOver na true, igra je završila
    if (gameStatus.score > localStorage.getItem('maxScore')) { // ako je score u igri veći od maxScora tada
        localStorage.setItem('maxScore', gameStatus.score); // postavi vrijednost maxScorea u localStorageu na novi score
    }
}

window.onload = gameLoop; // kada se stranica učita u potpunosti tada pozovi funkciju gameLoop da se izvrši