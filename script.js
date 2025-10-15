document.addEventListener('DOMContentLoaded', () => {

    // --- CONTAGEM REGRESSIVA ANIMADA ---
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const weddingDate = new Date("Oct 25, 2026 16:00:00").getTime();

        const updateCountdown = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                clearInterval(updateCountdown);
                countdownElement.innerHTML = "Felizes para Sempre!";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `
                <div><span>${days}</span>Dias</div>
                <div><span>${hours}</span>Horas</div>
                <div><span>${minutes}</span>Minutos</div>
                <div><span>${seconds}</span>Segundos</div>
            `;
        }, 1000);
    }

    // --- ANIMAÇÃO DE REVELAÇÃO AO ROLAR ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- MODAL DA GALERIA ---
    window.openModal = (src) => {
        const modal = document.getElementById('gallery-modal');
        const modalImg = document.getElementById('modal-image');
        modal.style.display = "block";
        modalImg.src = src;
    }

    const modal = document.getElementById('gallery-modal');
    if (modal) {
        const closeModal = document.getElementsByClassName("close-modal")[0];
        closeModal.onclick = () => modal.style.display = "none";
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    // --- LÓGICA DOS FORMULÁRIOS ---
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', handleFormSubmit);
    }

    const purchaseForm = document.getElementById('purchase-form');
    if (purchaseForm) {
        // Preenche dados do presente
        const params = new URLSearchParams(window.location.search);
        document.getElementById('gift-title').textContent = params.get('title') || 'Nosso Presente';
        document.getElementById('gift-amount').value = parseFloat(params.get('price') || '50.00').toFixed(2);
        document.getElementById('hidden-gift-title').value = params.get('title') || 'Não especificado';
        
        purchaseForm.addEventListener('submit', handleFormSubmit);
    }
});

async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const statusElement = document.getElementById(`${form.id}-status`);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // Se for o formulário de presente, mostra a tela de sucesso
            if (form.id === 'purchase-form') {
                const guestName = document.getElementById('guest-name').value;
                document.getElementById('guest-name-success').textContent = guestName;
                document.getElementById('form-wrapper').style.display = 'none';
                document.getElementById('success-message').classList.remove('hidden');
            } else { // Se for o RSVP
                if (statusElement) statusElement.textContent = 'Obrigado! Sua presença foi confirmada.';
                form.reset();
            }
        } else {
            throw new Error('Falha no envio.');
        }
    } catch (error) {
        if (statusElement) statusElement.textContent = 'Oops! Houve um erro. Tente novamente.';
        else alert('Oops! Houve um erro. Tente novamente.');
    }
}