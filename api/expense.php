<?php
header("Content-Type: application/json");
require_once "../config/database.php";

$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {

    // GET: Fetch all expenses
    case "GET":
        try {
            $stmt = $pdo->query("SELECT * FROM expenses ORDER BY expense_date DESC");
            $expenses = $stmt->fetchAll(PDO::FETCH_ASSOC); // only associative keys
            echo json_encode($expenses);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    // POST: Add a new expense
    case "POST":
        $data = json_decode(file_get_contents("php://input"), true);

        // Validation
        if (
            empty($data["description"]) ||
            !isset($data["amount"]) ||
            !is_numeric($data["amount"]) ||
            $data["amount"] <= 0 ||
            empty($data["category"]) ||
            empty($data["date"])
        ) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid input"]);
            exit;
        }

        try {
            $stmt = $pdo->prepare(
                "INSERT INTO expenses (description, amount, category, expense_date)
                 VALUES (?, ?, ?, ?)"
            );
            $stmt->execute([
                htmlspecialchars($data["description"]),
                $data["amount"],
                htmlspecialchars($data["category"]),
                $data["date"]
            ]);

            echo json_encode(["message" => "Expense added", "id" => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    // PUT: Update an existing expense
    case "PUT":
        $data = json_decode(file_get_contents("php://input"), true);

        if (
            empty($data["id"]) ||
            empty($data["description"]) ||
            !isset($data["amount"]) ||
            !is_numeric($data["amount"]) ||
            $data["amount"] <= 0 ||
            empty($data["category"]) ||
            empty($data["date"])
        ) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid input"]);
            exit;
        }

        try {
            $stmt = $pdo->prepare(
                "UPDATE expenses
                 SET description=?, amount=?, category=?, expense_date=?
                 WHERE id=?"
            );
            $stmt->execute([
                htmlspecialchars($data["description"]),
                $data["amount"],
                htmlspecialchars($data["category"]),
                $data["date"],
                $data["id"]
            ]);

            echo json_encode(["message" => "Expense updated"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    // DELETE: Remove an expense
    case "DELETE":
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data["id"])) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid input"]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM expenses WHERE id=?");
            $stmt->execute([$data["id"]]);

            echo json_encode(["message" => "Expense deleted"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
}
?>
