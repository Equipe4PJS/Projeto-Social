function gerarRelatorioPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurações de cores (baseadas no seu design)
    const corLaranja = [255, 140, 0];
    const corRoxa = [106, 90, 205];
    const corTexto = [50, 50, 50];

    // Cabeçalho / Banner Superior
    doc.setFillColor(...corLaranja);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("PlayClass", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Painel do Professor - Relatório Geral", 130, 20);

    // Subtítulo
    doc.setTextColor(...corTexto);
    doc.setFontSize(11);
    doc.text("Métricas de engajamento e evolução cognitiva em tempo real.", 14, 40);

    // --- SEÇÃO 1: MÉTRICAS GERAIS (Cards) ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Resumo Geral", 14, 52);

    // Dados das métricas extraídos do painel
    const metricas = [
        ["Turmas Ativas", "03"],
        ["Alunos Conectados", "42"],
        ["Missões Concluídas", "158"],
        ["Habilidade em Destaque", "Raciocínio Lógico"]
    ];

    doc.autoTable({
        startY: 56,
        head: [['Métrica', 'Valor']],
        body: metricas,
        theme: 'striped',
        headStyles: { fillStyle: 'F', fillColor: corRoxa, textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 4 }
    });

    // --- SEÇÃO 2: DETALHAMENTO DAS TURMAS ---
    let finalY = doc.lastAutoTable.finalY + 12;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Minhas Turmas", 14, finalY);

    const turmas = [
        ["Turma Alfa (1º Ano)", "15 Alunos ativos hoje", "Ativo"],
        ["Turma Beta (2º Ano)", "18 Alunos ativos hoje", "Ativo"],
        ["Oficina Social (Contraturno)", "9 Alunos ativos hoje", "Ativo"]
    ];

    doc.autoTable({
        startY: finalY + 4,
        head: [['Nome da Turma', 'Engajamento Hoje', 'Status']],
        body: turmas,
        theme: 'grid',
        headStyles: { fillColor: [80, 80, 80], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 5 }
    });

    // Rodapé
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text(`Relatório gerado em: ${dataAtual} - Sistema PlayClass`, 14, 285);

    // Baixar o arquivo PDF
    doc.save("Relatorio_PlayClass.pdf");
}