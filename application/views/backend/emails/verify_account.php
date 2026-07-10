<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verifica tu cuenta</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #0d6efd; padding: 30px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">¡Bienvenido a Recetar Fácil!</h1>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px; color: #333333; line-height: 1.6;">
                            <p style="font-size: 16px; margin-top: 0;">Hola, <strong><?php echo htmlspecialchars($name); ?></strong>:</p>
                            <p style="font-size: 14px;">Gracias por registrarte como Doctor en nuestra plataforma. Para completar tu registro y activar tu cuenta, por favor ingresa el siguiente código de verificación en la aplicación:</p>
                            
                            <table border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0; width: 100%;">
                                <tr>
                                    <td align="center" style="border-radius: 4px;">
                                        <div style="font-size: 32px; font-weight: bold; color: #333333; letter-spacing: 5px; background-color: #f8f9fa; border: 1px dashed #cccccc; padding: 15px 30px; display: inline-block; border-radius: 8px;">
                                            <?php echo htmlspecialchars($code); ?>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
                            <p style="font-size: 12px; color: #999999; margin-bottom: 0;">Este código de verificación expirará en 24 horas.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
