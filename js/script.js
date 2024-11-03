$(document).ready(function() {
    // Form submission handler
    $('#cryptoForm').on('submit', function(e) {
        e.preventDefault();
        
        // Clear previous error messages
        $('.errorMessage').empty();
        
        // Validation
        let isValid = true;
        let formData = new FormData();

        // Validate Name fields
        if (!$('input[name="Name_First"]').val().trim()) {
            $('#error-Name').text('First name is required');
            isValid = false;
        }
        if (!$('input[name="Name_Last"]').val().trim()) {
            $('#error-Name').text('Last name is required');
            isValid = false;
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = $('input[name="Email"]').val().trim();
        if (!email) {
            $('#error-Email').text('Email is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            $('#error-Email').text('Please enter a valid email address');
            isValid = false;
        }

        // Validate Phone
        const phone = $('input[name="PhoneNumber"]').val().trim();
        if (!phone) {
            $('#error-PhoneNumber').text('Phone number is required');
            isValid = false;
        }

        // Validate Cryptocurrency dropdown
        if ($('#Dropdown1-arialabel').val() === '-Select-') {
            $('#error-Dropdown1').text('Please select a cryptocurrency');
            isValid = false;
        }

        // Validate Currency
        const currency = $('input[name="Currency"]').val().trim();
        if (!currency) {
            $('#error-Currency').text('Value is required');
            isValid = false;
        } else if (isNaN(currency) || parseFloat(currency) <= 0) {
            $('#error-Currency').text('Please enter a valid amount');
            isValid = false;
        }

        // Validate Description
        if (!$('#MultiLine-arialabel').val().trim()) {
            $('#error-MultiLine').text('Description is required');
            isValid = false;
        }

        if (!isValid) {
            return false;
        }

        // Show loading state
        const submitBtn = $('button[elname="submit"]');
        const originalBtnText = submitBtn.html();
        submitBtn.html('<em>Sending...</em>');
        submitBtn.prop('disabled', true);

        // Prepare form data
        const formDataObj = {
            first_name: $('input[name="Name_First"]').val().trim(),
            last_name: $('input[name="Name_Last"]').val().trim(),
            email: email,
            phone: phone,
            cryptocurrency: $('#Dropdown1-arialabel').val(),
            value: currency,
            description: $('#MultiLine-arialabel').val().trim()
        };

        // Submit form using AJAX
        $.ajax({
            url: '../process_form.php',
            type: 'POST',
            data: formDataObj,
            success: function(response) {
                try {
                    const result = JSON.parse(response);
                    if (result.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'Your report has been submitted successfully.',
                            confirmButtonColor: '#3498db'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('#cryptoForm')[0].reset();
                            }
                        });
                    } else {
                        throw new Error(result.message || 'Something went wrong');
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.message || 'Something went wrong!',
                        confirmButtonColor: '#3498db'
                    });
                }
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'There was a problem submitting your form. Please try again.',
                    confirmButtonColor: '#3498db'
                });
            },
            complete: function() {
                // Reset button state
                submitBtn.html(originalBtnText);
                submitBtn.prop('disabled', false);
            }
        });
    });

    // Real-time validation
    $('input, textarea, select').on('input change', function() {
        const field = $(this);
        const errorDiv = field.closest('li').find('.errorMessage');
        
        if (field.prop('required') && !field.val().trim()) {
            errorDiv.text('This field is required');
        } else {
            errorDiv.text('');
        }
    });

    // Format currency input
    $('input[name="Currency"]').on('input', function() {
        let value = $(this).val().replace(/[^\d.]/g, '');
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        if (parts[1]?.length > 2) {
            value = parts[0] + '.' + parts[1].slice(0, 2);
        }
        $(this).val(value);
    });
});