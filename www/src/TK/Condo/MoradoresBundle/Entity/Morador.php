<?php

namespace TK\Condo\MoradoresBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Morador
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class Morador
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="Nome", type="string", length=255, unique=true)
     */
    private $nome;

    /**
     * @var string
     *
     * @ORM\Column(name="Cpf", type="string", length=11, nullable=true, unique=true)
     */
    private $cpf;

    /**
     * @var string
     *
     * @ORM\Column(name="Rg", type="string", length=11, nullable=true, unique=true)
     */
    private $rg;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="DataNascimento", type="date", nullable=true)
     */
    private $dataNascimento;

    /**
     * @var array
     *
     * @ORM\Column(name="Sexo", type="string", nullable=true)
     */
    private $sexo;

    /**
     * @var integer
     *
     * @ORM\Column(name="TelefoneCelular", type="bigint", nullable=true)
     */
    private $telefoneCelular;

    /**
     * @var string
     *
     * @ORM\Column(name="Foto", type="string", nullable=true)
     */
    private $foto;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set nome
     *
     * @param string $nome
     * @return Morador
     */
    public function setNome($nome)
    {
        $this->nome = $nome;

        return $this;
    }

    /**
     * Get nome
     *
     * @return string 
     */
    public function getNome()
    {
        return $this->nome;
    }

    /**
     * Set cpf
     *
     * @param string $cpf
     * @return Morador
     */
    public function setCpf($cpf)
    {
        $this->cpf = $cpf;

        return $this;
    }

    /**
     * Get cpf
     *
     * @return string 
     */
    public function getCpf()
    {
        return $this->cpf;
    }

    /**
     * Set rg
     *
     * @param string $rg
     * @return Morador
     */
    public function setRg($rg)
    {
        $this->rg = $rg;

        return $this;
    }

    /**
     * Get rg
     *
     * @return string 
     */
    public function getRg()
    {
        return $this->rg;
    }

    /**
     * Set dataNascimento
     *
     * @param \DateTime $dataNascimento
     * @return Morador
     */
    public function setDataNascimento($dataNascimento)
    {
        $this->dataNascimento = $dataNascimento;

        return $this;
    }

    /**
     * Get dataNascimento
     *
     * @return \DateTime 
     */
    public function getDataNascimento()
    {
        return $this->dataNascimento;
    }

    /**
     * Set sexo
     *
     * @param array $sexo
     * @return Morador
     */
    public function setSexo($sexo)
    {
        $this->sexo = $sexo;

        return $this;
    }

    /**
     * Get sexo
     *
     * @return array 
     */
    public function getSexo()
    {
        return $this->sexo;
    }

    /**
     * Set telefoneCelular
     *
     * @param integer $telefoneCelular
     * @return Morador
     */
    public function setTelefoneCelular($telefoneCelular)
    {
        $this->telefoneCelular = $telefoneCelular;

        return $this;
    }

    /**
     * Get telefoneCelular
     *
     * @return integer 
     */
    public function getTelefoneCelular()
    {
        return $this->telefoneCelular;
    }

    /**
     * Set foto
     *
     * @param string $foto
     * @return Morador
     */
    public function setFoto($foto)
    {
        $this->foto = $foto;

        return $this;
    }

    /**
     * Get foto
     *
     * @return string 
     */
    public function getFoto()
    {
        return $this->foto;
    }
}
