<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="adminStyles/dashboardPage.css?v=<?php echo time(); ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <title>Admin Dashboard</title>
</head>
<body>
    <?php include('adminTemplates/adminNavbar.php'); ?>
    <section class="background">
        <div class="adminName">
            <h1>Hello There, <?= $_SESSION["name"] ?></h1>
        </div>
        <div class="chart-container">
            <!-- for charts -->
        <canvas id="myChart"></canvas>
        </div>
    </section>

    <script>
        // Fetch data from PHP file
        fetch('api/data.php')
            .then(response => response.json())
            .then(data => {
                const labels = data.map(item => item.label);
                const values = data.map(item => item.value);

                // Render Chart using Chart.js
                const ctx = document.getElementById('myChart').getContext('2d');
                const myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Online Users',
                            data: values,
                            backgroundColor: 'rgba(51, 37, 37, 0.5)',
                            borderColor: 'rgb(0, 0, 0)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x:{grid:{display: false}},
                            y: {beginAtZero: true, grid:{display:false}}
                        }
                    }
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    </script>
</body>
</html>