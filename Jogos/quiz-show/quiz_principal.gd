extends Control

# Referências de Interface
@onready var label_pergunta = $TextoPergunta
@onready var label_placar = $PlacarDinheiro
@onready var botoes = $VBoxContainer.get_children()

# --- BANCO DE DADOS (Exemplo de expansão) ---
# Dica: Você pode continuar adicionando itens seguindo este padrão até chegar a 100
var banco_total = [
	# HISTÓRIA
	{"pergunta": "Quem foi o primeiro presidente do Brasil?", "opcoes": ["Dom Pedro II", "Deodoro da Fonseca", "Getúlio Vargas", "Juscelino Kubitschek"], "correta": 1},
	{"pergunta": "Em que ano caiu o Muro de Berlim?", "opcoes": ["1985", "1989", "1991", "1993"], "correta": 1},
	{"pergunta": "Qual civilização construiu as pirâmides de Gizé?", "opcoes": ["Incas", "Maias", "Egípcios", "Astecas"], "correta": 2},
	{"pergunta": "Quem foi o líder da Revolução Francesa?", "opcoes": ["Napoleão", "Robespierre", "Luís XVI", "Voltaire"], "correta": 1},
	{"pergunta": "A Guerra dos Cem Anos foi entre quais países?", "opcoes": ["Espanha e Portugal", "França e Inglaterra", "Itália e Grécia", "Alemanha e Rússia"], "correta": 1},
	
	# GEOGRAFIA
	{"pergunta": "Qual o maior país do mundo em extensão territorial?", "opcoes": ["Canadá", "China", "EUA", "Rússia"], "correta": 3},
	{"pergunta": "Em qual continente fica o Monte Everest?", "opcoes": ["África", "Europa", "Ásia", "América"], "correta": 2},
	{"pergunta": "Qual o rio mais extenso do mundo?", "opcoes": ["Nilo", "Amazonas", "Mississipi", "Ganges"], "correta": 1},
	{"pergunta": "Qual a capital da Austrália?", "opcoes": ["Sydney", "Melbourne", "Camberra", "Perth"], "correta": 2},
	{"pergunta": "Qual país tem o formato de uma bota?", "opcoes": ["Espanha", "Itália", "México", "Portugal"], "correta": 1},
	
	# CIÊNCIAS NATURAIS
	{"pergunta": "Qual o elemento químico mais abundante no universo?", "opcoes": ["Oxigênio", "Hélio", "Hidrogênio", "Carbono"], "correta": 2},
	{"pergunta": "Quantos ossos tem o corpo humano adulto?", "opcoes": ["150", "206", "300", "212"], "correta": 1},
	{"pergunta": "Qual planeta é conhecido como o 'Gigante Gasoso'?", "opcoes": ["Marte", "Vênus", "Júpiter", "Urano"], "correta": 2},
	{"pergunta": "Qual é a unidade básica da vida?", "opcoes": ["Átomo", "Célula", "Tecido", "Molécula"], "correta": 1},
	{"pergunta": "O que a fotossíntese produz além de energia?", "opcoes": ["Gás Carbônico", "Oxigênio", "Nitrogênio", "Hidrogênio"], "correta": 1},
	
	# Adicione mais 85 perguntas aqui para completar as 100...
]

# Variáveis de Jogo
var perguntas_da_partida = []
var pergunta_atual_index = 0
var premio_acumulado = 0

# Custos e Prêmios
var premio_por_acerto = 10000 # Valor fixo por acerto para simplificar
var custo_pular = 2000
var custo_cartas = 5000

func _ready():
	randomize() # Garante que o sorteio mude a cada vez que o jogo abrir
	preparar_partida()
	configurar_sinais_ajuda()
	configurar_botoes_resposta()
	exibir_pergunta()

func set_botoes_clicaveis(estado: bool):
	# Bloqueia ou desbloqueia os botões de resposta
	for b in botoes:
		b.disabled = !estado
	# Também bloqueia as ajudas para não pular enquanto o som toca
	$HBoxContainer/BtnPular.disabled = !estado
	$HBoxContainer/BtnCartas.disabled = !estado

func preparar_partida():
	# Embaralha o banco total e pega apenas 15 para esta rodada
	banco_total.shuffle()
	perguntas_da_partida = banco_total.slice(0, 15)
	pergunta_atual_index = 0
	premio_acumulado = 0
	atualizar_interface_placar()

func configurar_botoes_resposta():
	for i in range(botoes.size()):
		# Conecta cada botão passando seu índice (0 a 3)
		botoes[i].pressed.connect(_on_resposta_pressionada.bind(i))

func configurar_sinais_ajuda():
	# Conecte aqui os seus botões de ajuda manualmente ou via código:
	$HBoxContainer/BtnPular.pressed.connect(_on_pular_pressionado)
	$HBoxContainer/BtnCartas.pressed.connect(_on_cartas_pressionadas)

func exibir_pergunta():
	label_pergunta.modulate = Color.WHITE
	if pergunta_atual_index < perguntas_da_partida.size():
		var dados = perguntas_da_partida[pergunta_atual_index]
		label_pergunta.text = dados.pergunta
		
		for i in range(4):
			botoes[i].text = dados.opcoes[i]
			botoes[i].visible = true # Reseta a visibilidade (caso as cartas tenham escondido)
			botoes[i].modulate = Color.WHITE # Reseta cores de feedback
	else:
		vencer_jogo()

func _on_resposta_pressionada(indice):
	# 1. BLOQUEIA TUDO IMEDIATAMENTE
	set_botoes_clicaveis(false)
	
	var correta = perguntas_da_partida[pergunta_atual_index].correta
	$MusicaFundo.stop()
	
	if indice == correta:
		$SomSucesso.play()
		label_pergunta.text = "CERTA RESPOSTA!"
		label_pergunta.modulate = Color.GREEN
		
		premio_acumulado += premio_por_acerto
		pergunta_atual_index += 1
		atualizar_interface_placar()
		
		await get_tree().create_timer(2.0).timeout
		
		# 2. DESBLOQUEIA AO CARREGAR A PRÓXIMA
		label_pergunta.modulate = Color.WHITE
		$MusicaFundo.play()
		exibir_pergunta()
		set_botoes_clicaveis(true) 
		
	else:
		$SomErro.play()
		label_pergunta.text = "QUE PENA! VOCÊ ERROU."
		label_pergunta.modulate = Color.RED
		await get_tree().create_timer(3.0).timeout
		get_tree().reload_current_scene()
		
# --- LÓGICA DE AJUDAS ---

func _on_pular_pressionado():
	if premio_acumulado >= custo_pular:
		premio_acumulado -= custo_pular
		pergunta_atual_index += 1
		atualizar_interface_placar()
		exibir_pergunta()
	else:
		print("Saldo insuficiente para pular!")

func _on_cartas_pressionadas():
	if premio_acumulado >= custo_cartas:
		premio_acumulado -= custo_cartas
		atualizar_interface_placar()
		
		var correta = perguntas_da_partida[pergunta_atual_index].correta
		var escondidos = 0
		for i in range(4):
			if i != correta and escondidos < 2:
				botoes[i].visible = false
				escondidos += 1
	else:
		print("Saldo insuficiente para cartas!")

func atualizar_interface_placar():
	label_placar.text = "Prêmio: R$ " + str(premio_acumulado)

func vencer_jogo():
	label_pergunta.text = "PARABÉNS! VOCÊ É O NOVO MILIONÁRIO!"
	for b in botoes:
		b.visible = false
