 CRISP_RUNTIME_CONFIG = { locale: "en" }; // Thêm dòng này
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = "7bc512f3-5709-487a-adbb-0a65f598cc4b";
  (function() {
    d = document;
    s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = 1;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
  let timerInterval = null;

function startPaymentTimer() {
    let timeLeft = 900; // 15 phút = 900 giây
    const timerElement = document.getElementById('paymentTimer');

    if (!timerElement) {
        console.error('Không tìm thấy #paymentTimer');
        return;
    }

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = 'Time is up';
            alert('Payment time has expired. Please try again.');
            const qrModalElement = document.getElementById('qrPaymentModal');
            if (qrModalElement) {
                const qrModal = bootstrap.Modal.getInstance(qrModalElement);
                if (qrModal) qrModal.hide();
            }
            return;
        }

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;
    }, 1000);
}

function stopPaymentTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Modal USDT
function showQRPaymentModal(type) {
    console.log(`showQRPaymentModal called with type: ${type}`);

    // Kiểm tra input số tiền
    const amountInput = document.getElementById(`amount${type}`);
    if (!amountInput) {
        console.error(`Không tìm thấy #amount${type}`);
        alert('Lỗi hệ thống: Không tìm thấy trường nhập số tiền. Vui lòng thử lại.');
        return;
    }

    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) {
        console.error(`Invalid USDT Amount: ${amount}`);
        alert('Please enter a valid USDT amount (greater than 0).');
        return;
    }

    // Lấy dữ liệu sản phẩm
    let productData;
    switch (type) {
        case 'Limit1500':
            productData = currentProductLimit1500;
            break;
        case 'NoLimit':
            productData = currentProductNoLimit;
            break;
        case 'Limit250':
            productData = currentProductLimit250;
            break;
        default:
            console.error('Loại sản phẩm không hợp lệ:', type);
            alert('Lỗi dữ liệu: Loại sản phẩm không hợp lệ. Vui lòng thử lại.');
            return;
    }

    if (!productData || !productData.name) {
        console.error(`Không tìm thấy dữ liệu sản phẩm cho ${type}`, productData);
        alert('Lỗi dữ liệu đơn hàng. Vui lòng thử lại.');
        return;
    }

    // Kiểm tra mã đơn hàng
    const orderCodeElement = document.getElementById(`orderCode${type}`);
    if (!orderCodeElement) {
        console.error(`Không tìm thấy #orderCode${type}`);
        alert('Lỗi hệ thống: Không tìm thấy mã đơn hàng. Vui lòng thử lại.');
        return;
    }

    // Kiểm tra các phần tử trong modal QR
    const qrElements = {
        productName: document.getElementById('qrProductName'),
        orderCode: document.getElementById('qrOrderCode'),
        totalPrice: document.getElementById('qrTotalPrice'),
        amount: document.getElementById('qrAmount'),
        amountText: document.getElementById('qrAmountText')
    };

    if (Object.values(qrElements).some(el => !el)) {
        console.error('Một hoặc nhiều phần tử HTML không tồn tại trong qrPaymentModal', qrElements);
        alert('Lỗi hệ thống: Không thể hiển thị modal thanh toán. Vui lòng thử lại.');
        return;
    }

    // Điền thông tin vào modal
    qrElements.productName.textContent = productData.name;
    qrElements.orderCode.textContent = orderCodeElement.textContent;
    qrElements.totalPrice.textContent = `${productData.totalPrice} USD`;
    qrElements.amount.textContent = `${amount} USDT`;
    qrElements.amountText.textContent = `${amount}`;

    // Kiểm tra và mở modal
    const qrModalElement = document.getElementById('qrPaymentModal');
    if (!qrModalElement) {
        console.error('Không tìm thấy #qrPaymentModal trong DOM');
        alert('Lỗi hệ thống: Không tìm thấy modal thanh toán. Vui lòng thử lại.');
        return;
    }

    try {
        const qrModal = new bootstrap.Modal(qrModalElement);
        console.log('Mở modal qrPaymentModal...');
        qrModal.show();

        // Khởi động bộ đếm thời gian
        startPaymentTimer();

        // Dừng bộ đếm khi modal đóng
        qrModalElement.addEventListener('hidden.bs.modal', stopPaymentTimer, { once: true });
    } catch (error) {
        console.error('Lỗi khi mở qrPaymentModal:', error);
        alert('Lỗi hệ thống: Không thể mở modal thanh toán. Vui lòng thử lại.');
    }
}

function confirmQRPayment() {
    const qrModalElement = document.getElementById('qrPaymentModal');
    if (qrModalElement) {
        const qrModal = bootstrap.Modal.getInstance(qrModalElement);
        if (qrModal) {
            console.log('Đóng modal qrPaymentModal...');
            qrModal.hide();
        }
        stopPaymentTimer();
        alert('Payment has been confirmed. We will check and update the order status soon.');
    } else {
        console.error('Không tìm thấy #qrPaymentModal');
    }
}
     // Hàm sao chép mã đơn hàng (giả định từ mã gốc)
    function copyOrderCode(type) {
        const orderCode = document.getElementById(`orderCode${type}`).textContent;
        navigator.clipboard.writeText(orderCode).then(() => {
            alert('Đã sao chép mã đơn hàng!');
        }).catch(err => {
            console.error('Lỗi khi sao chép:', err);
        });
    }

    // Hàm đóng modal (giả định từ mã gốc)
    function closeOrderModalNoLimit() {
        const modal = document.getElementById('step3-content-nolimit').closest('.modal');
        if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            } else {
                modal.classList.remove('show');
                modal.style.display = 'none';
            }
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
        }
    }
    emailjs.init("OlmDENkTvEwc35def"); // Thay bằng Public Key thực tế của bạn

    // Hàm tạo mã đơn hàng
    function generateOrderCode(productPrefix) {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const timeStr = date.getTime().toString().slice(-5);
        return `${productPrefix}-${dateStr}-${timeStr}`;
    }


    // Hàm hiển thị/ẩn input số lượng tùy chỉnh
    function toggleCustomQuantity(prefix) {
        const select = document.getElementById(`quantitySelect${prefix}`);
        const customDiv = document.getElementById(`quantityCustom${prefix}`);
        if (select && customDiv) {
            customDiv.style.display = select.value === 'custom' ? 'block' : 'none';
        }
    }

   // Hàm kiểm tra các trường bắt buộc
function validateInputs(prefix) {
    let isValid = true;
    const requiredFields = [
        { id: `customerName${prefix}`, message: 'Vui lòng nhập tên khách hàng hoặc định danh Telegram.' },
        { id: `bmId${prefix}`, message: 'Vui lòng nhập ít nhất một ID BM.' }
        // Email đã bị loại bỏ khỏi kiểm tra bắt buộc
    ];

    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input || !input.value.trim()) {
            if (input) input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });

    const select = document.getElementById(`quantitySelect${prefix}`);
    const customInput = document.getElementById(`quantityCustomInput${prefix}`);
    let quantity = 0;

    if (select && select.value === 'custom' && customInput) {
        quantity = parseInt(customInput.value) || 0;
        if (quantity < 1) {
            customInput.classList.add('is-invalid');
            isValid = false;
        } else {
            customInput.classList.remove('is-invalid');
        }
    } else if (select) {
        quantity = parseInt(select.value) || 0;
        if (quantity < 1) {
            select.classList.add('is-invalid');
            isValid = false;
        } else {
            select.classList.remove('is-invalid');
        }
    }

    return isValid;
}

    // Hàm hiển thị thông báo lỗi
    function showError(prefix, message) {
        const step2Content = document.getElementById(`step2-content${prefix.toLowerCase().replace('$', '')}`);
        if (!step2Content) return;

        const existingError = step2Content.querySelector('.alert-danger');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.textContent = message;
        step2Content.prepend(errorDiv);
    }

    // No Limit
    let currentProductNoLimit = {};

    function showOrderModalNoLimit() {
        const productName = 'BM Invitation (NoLimit)';
        const basePrice = 60;
        const imageUrl = 'img/nolimit.jpg';
        const description = '描述：旧帐户（2021 年至 2023 年）, 通过您的 BM 实现完全控制和所有权 ,已验证公司，Meta Business 总监（反禁令助推者）, 广告帐户已准备好立即启动广告活动 ,您拥有完全的访问权和所有权。,  我们的 BM 已预先验证且干净 - 更改您的时区、货币和国家/地区 , 更改时区/货币/国家（分享 BM ID） ';

        currentProductNoLimit = { name: productName, image: imageUrl, description: description };

        const nameElement = document.getElementById('productNameNoLimit');
        const priceElement = document.getElementById('productPriceNoLimit');
        const imageElement = document.getElementById('productImageNoLimit');
        const descElement = document.getElementById('productDescriptionNoLimit');

        if (nameElement) nameElement.textContent = productName;
        if (priceElement) priceElement.textContent = `$${basePrice}`;
        if (imageElement) imageElement.src = imageUrl;
        if (descElement) descElement.textContent = `${description}`;

        const selectElement = document.getElementById('quantitySelectNoLimit');
        if (selectElement) selectElement.value = '1';
        toggleCustomQuantity('NoLimit');
        updatePriceNoLimit();

        const modal = document.getElementById('orderModalNoLimit');
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');

            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
        }
    }

    function updatePriceNoLimit() {
        const select = document.getElementById('quantitySelectNoLimit');
        const customInput = document.getElementById('quantityCustomInputNoLimit');
        let quantity = 1;

        if (select && select.value === 'custom' && customInput) {
            quantity = parseInt(customInput.value) || 1;
        } else if (select) {
            quantity = parseInt(select.value) || 1;
        }

        let unitPrice = 60;
        let discountPercent = 0;

        if (quantity >= 10) {
            unitPrice = 57;
            discountPercent = 5;
        }
        if (quantity >= 50) {
            unitPrice = 51;
            discountPercent = 15;
        }

        const totalPrice = quantity * unitPrice;

        const discountElement = document.getElementById('discountPercentNoLimit');
        const unitPriceElement = document.getElementById('unitPriceNoLimit');
        const totalPriceElement = document.getElementById('totalPriceNoLimit');

        if (discountElement) discountElement.textContent = `${discountPercent}%`;
        if (unitPriceElement) unitPriceElement.textContent = `${unitPrice}`;
        if (totalPriceElement) totalPriceElement.textContent = `${totalPrice}`;

        currentProductNoLimit.quantity = quantity;
        currentProductNoLimit.unitPrice = unitPrice;
        currentProductNoLimit.totalPrice = totalPrice;
    }

    function validateAndSubmitNoLimit() {
        if (!validateInputs('NoLimit')) return;

        const orderCode = generateOrderCode('NL');
        currentProductNoLimit.orderCode = orderCode;

        const orderData = {
            productName: currentProductNoLimit.name,
            quantity: currentProductNoLimit.quantity,
            unitPrice: currentProductNoLimit.unitPrice,
            totalPrice: currentProductNoLimit.totalPrice,
            customerName: document.getElementById('customerNameNoLimit')?.value.trim() || '',
            bmId: document.getElementById('bmIdNoLimit')?.value.trim() || '',
            email: document.getElementById('emailNoLimit')?.value.trim() || '',
            additionalInfo: document.getElementById('additionalInfoNoLimit')?.value.trim() || 'Không có ghi chú',
            orderCode: orderCode
        };

        emailjs.send('service_0jk1e5b', 'template_ehmxvd7', orderData)
            .then(function(response) {
                nextStepNoLimit(3, orderCode);
            }, function(error) {
                showError('NoLimit', 'Đặt hàng thất bại. Vui lòng thử lại! Lỗi: ' + JSON.stringify(error));
            });
    }
    
    function copyOrderCode(type) {
    let orderCodeElement;
    if (type === 'NoLimit') {
        orderCodeElement = document.getElementById('orderCodeNoLimit');
    } else if (type === 'Limit1500') {
        orderCodeElement = document.getElementById('orderCodeLimit1500');
    } else if (type === 'Limit250') {
        orderCodeElement = document.getElementById('orderCodeLimit250');
    } else {
        alert('Không xác định được loại mã đơn hàng.');
        return;
    }

    if (orderCodeElement) {
        const orderCode = orderCodeElement.textContent;
        navigator.clipboard.writeText(orderCode).then(() => {
            alert('Order code has been copied: ' + orderCode);
        }).catch(err => {
            console.error('Lỗi khi sao chép mã đơn hàng: ', err);
            alert('Không thể sao chép mã đơn hàng. Vui lòng thử lại.');
        });
    } else {
        alert('Không tìm thấy mã đơn hàng.');
    }
}

    function closeOrderModalNoLimit() {
        const modal = document.getElementById('orderModalNoLimit');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');

            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
        }

        resetModalNoLimit();
    }

    function nextStepNoLimit(step, orderCode = '') {
        const contents = document.querySelectorAll('#orderModalNoLimit .step-content');
        contents.forEach(content => content.classList.add('d-none'));

        const stepContent = document.getElementById(`step${step}-content-nolimit`);
        if (stepContent) stepContent.classList.remove('d-none');

        const steps = document.querySelectorAll('#orderModalNoLimit .progress-step');
        steps.forEach(stepCircle => {
            stepCircle.classList.remove('bg-primary', 'text-white');
            stepCircle.classList.add('bg-secondary', 'text-white');
        });

        const stepElement = document.getElementById(`step${step}-nolimit`);
        if (stepElement) stepElement.classList.add('bg-primary', 'text-white');

        const progressLine = document.getElementById('progress-line-nolimit');
        if (progressLine) {
            progressLine.style.width = step >= 2 ? '50%' : '0%';
        }
        const progressLine2 = document.getElementById('progress-line-nolimit-2');
        if (progressLine2) {
            progressLine2.style.width = step === 3 ? '50%' : '0%';
        }

        if (step === 3 && orderCode) {
            const orderCodeElement = document.getElementById('orderCodeNoLimit');
            if (orderCodeElement) orderCodeElement.textContent = orderCode;
        }
    }

    function prevStepNoLimit(step) {
        nextStepNoLimit(step);
    }

    function resetModalNoLimit() {
        const contents = document.querySelectorAll('#orderModalNoLimit .step-content');
        contents.forEach(content => content.classList.add('d-none'));

        const step1Content = document.getElementById('step1-content-nolimit');
        if (step1Content) step1Content.classList.remove('d-none');

        const steps = document.querySelectorAll('#orderModalNoLimit .progress-step');
        steps.forEach(stepCircle => {
            stepCircle.classList.remove('bg-primary', 'text-white');
            stepCircle.classList.add('bg-secondary', 'text-white');
        });

        const step1Element = document.getElementById('step1-nolimit');
        if (step1Element) step1Element.classList.add('bg-primary', 'text-white');

        const progressLine = document.getElementById('progress-line-nolimit');
        if (progressLine) progressLine.style.width = '0%';
        const progressLine2 = document.getElementById('progress-line-nolimit-2');
        if (progressLine2) progressLine2.style.width = '0%';

        const selectElement = document.getElementById('quantitySelectNoLimit');
        if (selectElement) selectElement.value = '1';

        const customInput = document.getElementById('quantityCustomInputNoLimit');
        if (customInput) customInput.value = '1';

        toggleCustomQuantity('NoLimit');

        const customerNameElement = document.getElementById('customerNameNoLimit');
        if (customerNameElement) customerNameElement.value = '';

        const bmIdElement = document.getElementById('bmIdNoLimit');
        if (bmIdElement) bmIdElement.value = '';

        const emailElement = document.getElementById('emailNoLimit');
        if (emailElement) emailElement.value = '';

        const additionalInfoElement = document.getElementById('additionalInfoNoLimit');
        if (additionalInfoElement) additionalInfoElement.value = '';

        const orderCodeElement = document.getElementById('orderCodeNoLimit');
        if (orderCodeElement) orderCodeElement.textContent = '';

        updatePriceNoLimit();
    }

    // Limit 250$
    let currentProductLimit250 = {};

    function showOrderModalLimit250() {
        const productName = 'BM Invitation ($250 Limit)';
        const basePrice = 40;
        const imageUrl = 'img/250limit.jpg';
        const description = '描述：没有 Facebook 帐户，只有 BM ,  简洁的 Meta Business Manager , 可立即启动广告活动的广告帐户（每个帐户的广告支出为 250 美元） , 之前被禁止但已恢复（强化反禁令）, 完全控制权和所有权 , 24小时内送达 , 更改时区/货币/国家（分享 BM ID）';

        currentProductLimit250 = { name: productName, image: imageUrl, description: description };

        const nameElement = document.getElementById('productNameLimit250');
        const priceElement = document.getElementById('productPriceLimit250');
        const imageElement = document.getElementById('productImageLimit250');
        const descElement = document.getElementById('productDescriptionLimit250');

        if (nameElement) nameElement.textContent = productName;
        if (priceElement) priceElement.textContent = `$${basePrice}`;
        if (imageElement) imageElement.src = imageUrl;
        if (descElement) descElement.textContent = ` ${description}`;

        const selectElement = document.getElementById('quantitySelectLimit250');
        if (selectElement) selectElement.value = '1';
        toggleCustomQuantity('Limit250');
        updatePriceLimit250();

        const modal = document.getElementById('orderModalLimit250');
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');

            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
        }
    }

    function updatePriceLimit250() {
        const select = document.getElementById('quantitySelectLimit250');
        const customInput = document.getElementById('quantityCustomInputLimit250');
        let quantity = 1;

        if (select && select.value === 'custom' && customInput) {
            quantity = parseInt(customInput.value) || 1;
        } else if (select) {
            quantity = parseInt(select.value) || 1;
        }

        let unitPrice = 40;
        let discountPercent = 0;

        if (quantity >= 10) {
            unitPrice = 38;
            discountPercent = 5;
        }
        if (quantity >= 50) {
            unitPrice = 35;
            discountPercent = 12.5;
        }

        const totalPrice = quantity * unitPrice;

        const discountElement = document.getElementById('discountPercentLimit250');
        const unitPriceElement = document.getElementById('unitPriceLimit250');
        const totalPriceElement = document.getElementById('totalPriceLimit250');

        if (discountElement) discountElement.textContent = `${discountPercent}%`;
        if (unitPriceElement) unitPriceElement.textContent = `${unitPrice}`;
        if (totalPriceElement) totalPriceElement.textContent = `${totalPrice}`;

        currentProductLimit250.quantity = quantity;
        currentProductLimit250.unitPrice = unitPrice;
        currentProductLimit250.totalPrice = totalPrice;
    }

    function validateAndSubmitLimit250() {
        if (!validateInputs('Limit250')) return;

        const orderCode = generateOrderCode('L250');
        currentProductLimit250.orderCode = orderCode;

        const orderData = {
            productName: currentProductLimit250.name,
            quantity: currentProductLimit250.quantity,
            unitPrice: currentProductLimit250.unitPrice,
            totalPrice: currentProductLimit250.totalPrice,
            customerName: document.getElementById('customerNameLimit250')?.value.trim() || '',
            bmId: document.getElementById('bmIdLimit250')?.value.trim() || '',
            email: document.getElementById('emailLimit250')?.value.trim() || '',
            additionalInfo: document.getElementById('additionalInfoLimit250')?.value.trim() || 'Không có ghi chú',
            orderCode: orderCode
        };

        emailjs.send('service_0jk1e5b', 'template_ehmxvd7', orderData)
            .then(function(response) {
                nextStepLimit250(3, orderCode);
            }, function(error) {
                showError('Limit250', 'Đặt hàng thất bại. Vui lòng thử lại! Lỗi: ' + JSON.stringify(error));
            });
    }

    function closeOrderModalLimit250() {
        const modal = document.getElementById('orderModalLimit250');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');

            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
        }

        resetModalLimit250();
    }

    function nextStepLimit250(step, orderCode = '') {
        const contents = document.querySelectorAll('#orderModalLimit250 .step-content');
        contents.forEach(content => content.classList.add('d-none'));

        const stepContent = document.getElementById(`step${step}-content-limit250`);
        if (stepContent) stepContent.classList.remove('d-none');

        const steps = document.querySelectorAll('#orderModalLimit250 .progress-step');
        steps.forEach(stepCircle => {
            stepCircle.classList.remove('bg-primary', 'text-white');
            stepCircle.classList.add('bg-secondary', 'text-white');
        });

        const stepElement = document.getElementById(`step${step}-limit250`);
        if (stepElement) stepElement.classList.add('bg-primary', 'text-white');

        const progressLine = document.getElementById('progress-line-limit250');
        if (progressLine) {
            progressLine.style.width = step >= 2 ? '50%' : '0%';
        }
        const progressLine2 = document.getElementById('progress-line-limit250-2');
        if (progressLine2) {
            progressLine2.style.width = step === 3 ? '50%' : '0%';
        }

        if (step === 3 && orderCode) {
            const orderCodeElement = document.getElementById('orderCodeLimit250');
            if (orderCodeElement) orderCodeElement.textContent = orderCode;
        }
    }

    function prevStepLimit250(step) {
        nextStepLimit250(step);
    }

    function resetModalLimit250() {
        const contents = document.querySelectorAll('#orderModalLimit250 .step-content');
        contents.forEach(content => content.classList.add('d-none'));

        const step1Content = document.getElementById('step1-content-limit250');
        if (step1Content) step1Content.classList.remove('d-none');

        const steps = document.querySelectorAll('#orderModalLimit250 .progress-step');
        steps.forEach(stepCircle => {
            stepCircle.classList.remove('bg-primary', 'text-white');
            stepCircle.classList.add('bg-secondary', 'text-white');
        });

        const step1Element = document.getElementById('step1-limit250');
        if (step1Element) step1Element.classList.add('bg-primary', 'text-white');

        const progressLine = document.getElementById('progress-line-limit250');
        if (progressLine) progressLine.style.width = '0%';
        const progressLine2 = document.getElementById('progress-line-limit250-2');
        if (progressLine2) progressLine2.style.width = '0%';

        const selectElement = document.getElementById('quantitySelectLimit250');
        if (selectElement) selectElement.value = '1';

        const customInput = document.getElementById('quantityCustomInputLimit250');
        if (customInput) customInput.value = '1';

        toggleCustomQuantity('Limit250');

        const customerNameElement = document.getElementById('customerNameLimit250');
        if (customerNameElement) customerNameElement.value = '';

        const bmIdElement = document.getElementById('bmIdLimit250');
        if (bmIdElement) bmIdElement.value = '';

        const emailElement = document.getElementById('emailLimit250');
        if (emailElement) emailElement.value = '';

        const additionalInfoElement = document.getElementById('additionalInfoLimit250');
        if (additionalInfoElement) additionalInfoElement.value = '';

        const orderCodeElement = document.getElementById('orderCodeLimit250');
        if (orderCodeElement) orderCodeElement.textContent = '';

        updatePriceLimit250();
    }

    // Limit 1500$
    let currentProductLimit1500 = {};

    function showOrderModalLimit1500() {
        const productName = 'Personal account Nolimit - 250$ Limit - 1500$ Limit';
        const basePrice = 45;
        const imageUrl = 'img/1500limit.jpg';
        const description = '描述：简洁的 Meta Business Manager。, 广告帐户可立即启动广告活动 , 包括邮件访问 , 完全控制权和所有权 , 24小时内送达';

        currentProductLimit1500 = { name: productName, image: imageUrl, description: description };

        const nameElement = document.getElementById('productNameLimit1500');
        const priceElement = document.getElementById('productPriceLimit1500');
        const imageElement = document.getElementById('productImageLimit1500');
        const descElement = document.getElementById('productDescriptionLimit1500');

        if (nameElement) nameElement.textContent = productName;
        if (priceElement) priceElement.textContent = `$${basePrice}`;
        if (imageElement) imageElement.src = imageUrl;
        if (descElement) descElement.textContent = `${description}`;

        const selectElement = document.getElementById('quantitySelectLimit1500');
        if (selectElement) selectElement.value = '1';
        toggleCustomQuantity('Limit1500');
        updatePriceLimit1500();

        const modal = document.getElementById('orderModalLimit1500');
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');

            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
        }
    }

    function updatePriceLimit1500() {
        const select = document.getElementById('quantitySelectLimit1500');
        const customInput = document.getElementById('quantityCustomInputLimit1500');
        let quantity = 1;

        if (select && select.value === 'custom' && customInput) {
            quantity = parseInt(customInput.value) || 1;
        } else if (select) {
            quantity = parseInt(select.value) || 1;
        }

        let unitPrice = 45;
        let discountPercent = 0;

        if (quantity >= 10) {
            unitPrice = 42.75;
            discountPercent = 5;
        }
        if (quantity >= 50) {
            unitPrice = 40.5;
            discountPercent = 10;
        }

        const totalPrice = quantity * unitPrice;

        const discountElement = document.getElementById('discountPercentLimit1500');
        const unitPriceElement = document.getElementById('unitPriceLimit1500');
        const totalPriceElement = document.getElementById('totalPriceLimit1500');

        if (discountElement) discountElement.textContent = `${discountPercent}%`;
        if (unitPriceElement) unitPriceElement.textContent = `${unitPrice}`;
        if (totalPriceElement) totalPriceElement.textContent = `${totalPrice}`;

        currentProductLimit1500.quantity = quantity;
        currentProductLimit1500.unitPrice = unitPrice;
        currentProductLimit1500.totalPrice = totalPrice;
    }

    function validateAndSubmitLimit1500() {
        if (!validateInputs('Limit1500')) return;

        const orderCode = generateOrderCode('L1500');
        currentProductLimit1500.orderCode = orderCode;

        const orderData = {
            productName: currentProductLimit1500.name,
            quantity: currentProductLimit1500.quantity,
            unitPrice: currentProductLimit1500.unitPrice,
            totalPrice: currentProductLimit1500.totalPrice,
            customerName: document.getElementById('customerNameLimit1500')?.value.trim() || '',
            bmId: document.getElementById('bmIdLimit1500')?.value.trim() || '',
            email: document.getElementById('emailLimit1500')?.value.trim() || '',
            additionalInfo: document.getElementById('additionalInfoLimit1500')?.value.trim() || 'Không có ghi chú',
            orderCode: orderCode
        };

        emailjs.send('service_0jk1e5b', 'template_ehmxvd7', orderData)
            .then(function(response) {
                nextStepLimit1500(3, orderCode);
            }, function(error) {
                showError('Limit1500', 'Đặt hàng thất bại. Vui lòng thử lại! Lỗi: ' + JSON.stringify(error));
            });
    }

    function closeOrderModalLimit1500() {
        const modal = document.getElementById('orderModalLimit1500');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');

            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
        }

        resetModalLimit1500();
    }

    function nextStepLimit1500(step, orderCode = '') {
        const contents = document.querySelectorAll('#orderModalLimit1500 .step-content');
        contents.forEach(content => content.classList.add('d-none'));

        const stepContent = document.getElementById(`step${step}-content-limit1500`);
        if (stepContent) stepContent.classList.remove('d-none');

        const steps = document.querySelectorAll('#orderModalLimit1500 .progress-step');
        steps.forEach(stepCircle => {
            stepCircle.classList.remove('bg-primary', 'text-white');
            stepCircle.classList.add('bg-secondary', 'text-white');
        });

        const stepElement = document.getElementById(`step${step}-limit1500`);
        if (stepElement) stepElement.classList.add('bg-primary', 'text-white');

        const progressLine = document.getElementById('progress-line-limit1500');
        if (progressLine) {
            progressLine.style.width = step >= 2 ? '50%' : '0%';
        }
        const progressLine2 = document.getElementById('progress-line-limit1500-2');
        if (progressLine2) {
            progressLine2.style.width = step === 3 ? '50%' : '0%';
        }

        if (step === 3 && orderCode) {
            const orderCodeElement = document.getElementById('orderCodeLimit1500');
            if (orderCodeElement) orderCodeElement.textContent = orderCode;
        }
    }

    function prevStepLimit1500(step) {
        nextStepLimit1500(step);
    }

    function resetModalLimit1500() {
        const contents = document.querySelectorAll('#orderModalLimit1500 .step-content');
        contents.forEach(content => content.classList.add('d-none'));

        const step1Content = document.getElementById('step1-content-limit1500');
        if (step1Content) step1Content.classList.remove('d-none');

        const steps = document.querySelectorAll('#orderModalLimit1500 .progress-step');
        steps.forEach(stepCircle => {
            stepCircle.classList.remove('bg-primary', 'text-white');
            stepCircle.classList.add('bg-secondary', 'text-white');
        });

        const step1Element = document.getElementById('step1-limit1500');
        if (step1Element) step1Element.classList.add('bg-primary', 'text-white');

        const progressLine = document.getElementById('progress-line-limit1500');
        if (progressLine) progressLine.style.width = '0%';
        const progressLine2 = document.getElementById('progress-line-limit1500-2');
        if (progressLine2) progressLine2.style.width = '0%';

        const selectElement = document.getElementById('quantitySelectLimit1500');
        if (selectElement) selectElement.value = '1';

        const customInput = document.getElementById('quantityCustomInputLimit1500');
        if (customInput) customInput.value = '1';

        toggleCustomQuantity('Limit1500');

        const customerNameElement = document.getElementById('customerNameLimit1500');
        if (customerNameElement) customerNameElement.value = '';

        const bmIdElement = document.getElementById('bmIdLimit1500');
        if (bmIdElement) bmIdElement.value = '';

        const emailElement = document.getElementById('emailLimit1500');
        if (emailElement) emailElement.value = '';

        const additionalInfoElement = document.getElementById('additionalInfoLimit1500');
        if (additionalInfoElement) additionalInfoElement.value = '';

        const orderCodeElement = document.getElementById('orderCodeLimit1500');
        if (orderCodeElement) orderCodeElement.textContent = '';

        updatePriceLimit1500();
    }