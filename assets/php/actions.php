<?php

class Database{
    private $host='localhost';
    private $name='quizzizy';
    private $user='root';
    private $password='';

    private $pdo;
    private $stmt;
    public function __construct()
    {
        $dsn='mysql:host='.$this->host.';dbname='.$this->name;
        try{
           $this->pdo=new PDO($dsn,$this->user,$this->password);
           $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
        }catch(PDOException $e){
            echo "Erreur de connexion".$e->getMessage();
        }
    }
    public function __destruct()
    {
        if($this->stmt !== null){
            $this->stmt=null;
        }
        if($this->pdo!==null){
            $this->pdo=null;
        }
    }
    
    public function fetchAll($query){
        try {
            $sqlstatment = $this->pdo->prepare($query);
            $sqlstatment->execute();
            return $sqlstatment->fetchAll();
        } catch (PDOException $e) {
            "Erreur" . $e->getMessage();
        }
    }



}


function generateJsonQuestionAnswersData(){
    
    $instance = new Database();
   $data_questions =  $instance->fetchAll('SELECT * FROM questions');
   $data_answers_explanation =  $instance->fetchAll('SELECT * FROM answers_explanation');
   
   
    $dataQuestions = json_encode($data_questions);
    $dataAnswersExplanation = json_encode($data_answers_explanation);
    
    $filename_questions = 'questions_data.json';
    $filename_answers_explanation = 'answers_explanation_data.json';
    if(file_put_contents($filename_answers_explanation,$dataAnswersExplanation)) echo "answers_explanation_data generated successfully <br>";
    if(file_put_contents($filename_questions,$dataQuestions)) echo "questions_data generated successfully";

    switch (json_last_error()) {
        case JSON_ERROR_NONE:
            echo ' - No errors';
        break;
        case JSON_ERROR_DEPTH:
            echo ' - Maximum stack depth exceeded';
        break;
        case JSON_ERROR_STATE_MISMATCH:
            echo ' - Underflow or the modes mismatch';
        break;
        case JSON_ERROR_CTRL_CHAR:
            echo ' - Unexpected control character found';
        break;
        case JSON_ERROR_SYNTAX:
            echo ' - Syntax error, malformed JSON';
        break;
        case JSON_ERROR_UTF8:
            echo ' - Malformed UTF-8 characters, possibly incorrectly encoded';
        break;
        default:
            echo ' - Unknown error';
        break;
    }

}

generateJsonQuestionAnswersData();

print_r($_SERVER)

?>